'use client'

import React from 'react'
import {
	EPISODE_LIST_QUERY_KEY,
	RENAME_EPISODE_MUTATION,
} from '@/constants/query-constants'
import { BubbleCheckIcon } from '@/icons/bubble-check-icon'
import { BubbleCrossedIcon } from '@/icons/bubble-crossed-icon'
import { saveContent } from '@/server-action/content-action'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { FetchResponseResult } from '@/lib/fetch-api'

import { TEpisode, TPatchEpisodeBody } from '@/types/episode-type'

type TRenameFuncProps = {
	episode: TEpisode
	newTitle: string
}
const useRenameTitleMutation = () => {
	const queryClient = useQueryClient()

	const onSuccess = async (
		_: FetchResponseResult<TPatchEpisodeBody>,
		arg: TRenameFuncProps
	) => {
		await queryClient.refetchQueries({
			queryKey: [EPISODE_LIST_QUERY_KEY, arg.episode?.project],
		})
		toast.success('Title renamed successfully', {
			icon: <BubbleCheckIcon />,
		})
	}

	const onError = (error: Error) => {
		toast.error(
			error.message || 'Something went wrong while renaming the title',
			{
				icon: <BubbleCrossedIcon />,
			}
		)
	}

	const onRenameTitleMutation = async ({
		newTitle,
		episode,
	}: TRenameFuncProps) => {
		if (!newTitle || !episode?.id) {
			throw new Error('New title or episode ID is missing')
		}

		return saveContent({
			projectId: episode.project,
			episodeId: episode.parent ?? episode.id,
			id: episode.id,
			status: episode.status,
			language: episode.language,
			chapter_title: newTitle,
		})
	}

	const renameTitleMutation = useMutation({
		mutationKey: [RENAME_EPISODE_MUTATION],
		mutationFn: onRenameTitleMutation,
		onSuccess,
		onError: (error: Error) => onError(error),
	})
	return renameTitleMutation
}

export default useRenameTitleMutation

'use client'

import React from 'react'
import { useParams } from 'next/navigation'
import {
	EPISODE_LIST_QUERY_KEY,
	RENAME_EPISODE_MUTATION,
} from '@/constants/query-constants'
import { BubbleCheckIcon } from '@/icons/bubble-check-icon'
import { getEpisodeContent, saveContent } from '@/server-action/content-action'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

const useRenameTitleMutation = () => {
	const { id } = useParams()
	const queryClient = useQueryClient()

	const onSuccess = async () => {
		await queryClient.invalidateQueries({
			queryKey: [EPISODE_LIST_QUERY_KEY, Number(id)],
			type: 'all',
		})
		toast.success('Title renamed successfully', {
			icon: <BubbleCheckIcon />,
		})
	}

	const onError = (error: Error) => {
		toast.error(
			error.message || 'Something went wrong while renaming the title'
		)
	}

	const onRenameTitleMutation = async ({
		newTitle,
		episodeId,
	}: {
		episodeId: number
		newTitle: string
	}) => {
		if (!newTitle || !episodeId) {
			throw new Error('New title or episode ID is missing')
		}

		const episodeContent = await getEpisodeContent(episodeId)
		if (!episodeContent) {
			throw new Error('Episode content not found')
		}

		const {
			text,
			chapter: { status, language, parent: parentId, word_count },
		} = episodeContent

		return saveContent({
			projectId: Number(id),
			episodeId: parentId || episodeId,
			id: episodeId,
			text,
			status,
			language,
			word_count,
			chapter_title: newTitle,
		})
	}

	const renameTitleMutation = useMutation({
		mutationKey: [RENAME_EPISODE_MUTATION, Number(id)],
		mutationFn: onRenameTitleMutation,
		onSuccess,
		onError: (error: Error) => onError(error),
	})
	return renameTitleMutation
}

export default useRenameTitleMutation

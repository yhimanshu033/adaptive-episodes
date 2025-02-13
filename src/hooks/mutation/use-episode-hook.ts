'use client'

import { useCallback, useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import {
	EPISODE_LIST_QUERY_KEY,
	EpisodeActions,
} from '@/constants/episodes-constants'
import { usePageState } from '@/hooks/use-page-state'
import useSocket from '@/hooks/use-socket'
import { saveContent } from '@/server-action/content-action'
import {
	deleteEpisode,
	inventEpisode,
	unmergeEpisodes,
} from '@/server-action/episode-action'
import { setFullScreenLoading } from '@/store/global-store'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { TComment } from '@udecode/plate-comments'

import useEpisodeId from '@/providers/episode-id-provider'

import { BASE_STATUS, EStatus } from '@/types/common'
import { TCustomComment } from '@/types/editor-types'
import { TEpisodeMergeParams } from '@/types/episode-type'
import { TNote } from '@/types/plate-types'

const useEpisodeHook = () => {
	const { id } = useParams()
	const episodeId = useEpisodeId()
	const { startTask, getResponse } = useSocket()
	const [updatedStatus, setUpdatedStatus] = useState<boolean>(false)
	const queryClient = useQueryClient()

	const { currentPage } = usePageState()

	const onSuccess = async () => {
		await queryClient.invalidateQueries({
			queryKey: [EPISODE_LIST_QUERY_KEY, Number(id), currentPage],
			type: 'all',
		})
	}

	const onSaveEpisode = useCallback(
		async ({
			text,
			status,
			chapterId,
			chapter_title,
			comments,
			notes,
			prevProps,
			word_count,
			resolvedComments,
		}: {
			chapterId?: number | null
			chapter_title?: string
			comments?: TComment[]
			notes?: TNote[]
			prevProps?: Record<string, unknown>
			resolvedComments?: TCustomComment[]
			status: EStatus | typeof BASE_STATUS
			text: string
			word_count?: number
		}) => {
			if (status === BASE_STATUS && !updatedStatus) {
				setUpdatedStatus(true)
				await saveContent({
					episodeId: chapterId ?? Number(episodeId),
					projectId: Number(id),
					text,
					status: EStatus.FIRST_DRAFT,
				})
			}
			return saveContent({
				episodeId: chapterId ?? Number(episodeId),
				projectId: Number(id),
				text,
				status: status === BASE_STATUS ? EStatus.FIRST_DRAFT : status,
				...(chapter_title ? { chapter_title } : {}),
				word_count,
				props: {
					...prevProps,
					comments,
					notes,
					resolvedComments,
				},
			})
		},
		[episodeId, id, updatedStatus]
	)

	const onEpisodeMerge = async (chapter_ids: number[]) => {
		const taskId = await startTask<TEpisodeMergeParams>({
			method: 'PATCH',
			url: '/chapters/merge/',
			body: {
				chapter_ids,
				project_id: Number(id),
				status: EStatus.FIRST_DRAFT,
			},
			noCache: true,
		})
		return getResponse(taskId)
	}

	const onEpisodeInvent = async ({
		chapter_title,
		seq_number,
	}: {
		chapter_title: string
		seq_number: number
	}) => {
		return inventEpisode({
			project_id: Number(id),
			chapter_title,
			seq_number,
		})
	}

	const onMetadataSync = async (chapterId: number) => {
		const taskId = await startTask({
			method: 'PATCH',
			url: '/chapters/:chapterId/sync_metadata',
			urlParams: {
				chapterId,
			},
		})
		return getResponse(taskId)
	}

	const saveEpisodeMutation = useMutation({
		mutationKey: [EpisodeActions.UPDATE, id, episodeId],
		mutationFn: onSaveEpisode,
	})

	const episodesMergeMutation = useMutation({
		mutationKey: [EpisodeActions.MERGE, id],
		mutationFn: onEpisodeMerge,
		onSuccess,
	})

	const episodeUnmergeMutation = useMutation({
		mutationKey: [EpisodeActions.UNMERGE, id],
		mutationFn: unmergeEpisodes,
		onSuccess,
	})

	const episodeInventMutation = useMutation({
		mutationKey: [EpisodeActions.INVENT, id],
		mutationFn: onEpisodeInvent,
		onSuccess,
	})

	const episodeDeleteMutation = useMutation({
		mutationKey: [EpisodeActions.DELETE, id],
		mutationFn: deleteEpisode,
		onSuccess,
	})

	const metadataSyncMutation = useMutation({
		mutationKey: [EpisodeActions.METATDATA, id],
		mutationFn: onMetadataSync,
	})

	useEffect(() => {
		setFullScreenLoading(
			(saveEpisodeMutation.isPending && !episodeId) ||
				episodesMergeMutation.isPending ||
				episodeUnmergeMutation.isPending ||
				episodeInventMutation.isPending ||
				episodeDeleteMutation.isPending
		)
	}, [
		episodeDeleteMutation.isPending,
		episodeId,
		episodeInventMutation.isPending,
		episodeUnmergeMutation.isPending,
		episodesMergeMutation.isPending,
		saveEpisodeMutation.isPending,
	])

	return {
		saveEpisodeMutation,
		episodesMergeMutation,
		episodeUnmergeMutation,
		episodeInventMutation,
		episodeDeleteMutation,
		metadataSyncMutation,
	}
}

export default useEpisodeHook

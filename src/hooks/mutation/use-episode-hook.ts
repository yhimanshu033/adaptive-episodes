'use client'

import { useCallback, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { EpisodeActions } from '@/constants/episodes-constants'
import { saveContent } from '@/server-action/content-action'
import {
	deleteEpisode,
	inventEpisode,
	unmergeEpisodes,
} from '@/server-action/episode-action'
import { useEpisodeStore } from '@/store/episode-store'
import { setFullScreenLoading } from '@/store/global-store'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { TComment } from '@udecode/plate-comments'

import { BASE_STATUS, EStatus } from '@/types/common'
import { TEpisodeMergeParams } from '@/types/episode-type'

import { usePageState } from '../use-page-state'
import useSocket from '../use-socket'

const useEpisodeHook = () => {
	const { id, episodeId } = useParams()
	const { startTask, getResponse } = useSocket()

	const queryClient = useQueryClient()

	const { episodeSearch } = useEpisodeStore()
	const { currentPage } = usePageState()

	const onSuccess = async () => {
		await queryClient.invalidateQueries({
			queryKey: [Number(id), 'episodes', currentPage, episodeSearch],
			type: 'all',
		})
	}

	const onSaveEpisode = useCallback(
		({
			text,
			status,
			chapterId,
			chapter_title,
			comments,
		}: {
			chapterId?: number | null
			chapter_title?: string
			comments?: TComment[]
			status: EStatus | typeof BASE_STATUS
			text: string
		}) => {
			return saveContent({
				episodeId: chapterId ?? Number(episodeId),
				projectId: Number(id),
				text,
				status: status === BASE_STATUS ? EStatus.FIRST_DRAFT : status,
				chapter_title,
				props: {
					comments,
				},
			})
		},
		[episodeId, id]
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

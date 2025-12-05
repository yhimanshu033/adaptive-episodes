'use client'

import { useCallback, useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { EpisodeActions } from '@/constants/episodes-constants'
import {
	EPISODE_LIST_QUERY_KEY,
	STORY_ID_QUERY_KEY,
} from '@/constants/query-constants'
// import useLanguage from '@/hooks/use-language'
import useSocket from '@/hooks/use-socket'
import { saveContent } from '@/server-action/content-action'
import {
	deleteEpisode,
	deleteMultipleEpisode,
	inventEpisode,
	unmergeEpisodes,
	updateStatus,
} from '@/server-action/episode-action'
import {
	setFullScreenLoading,
	setFullScreenLoadingMessage,
} from '@/store/global-store'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import useEpisodeId from '@/providers/episode-id-provider'

import { BASE_STATUS, ELanguage, EStatus } from '@/types/common'
import { TSaveEpisodeMutationArgs } from '@/types/content-types'
import { TEpisodeMergeParams, TEpisodeProps } from '@/types/episode-type'

import useAccessChecks from '../use-access-checks'

const useEpisodeHook = () => {
	const { id } = useParams()
	const episodeId = useEpisodeId()
	const { startTask, getResponse } = useSocket()
	const [updatedStatus, setUpdatedStatus] = useState<boolean>(false)
	const queryClient = useQueryClient()
	const { isGerman, isOriginal } = useAccessChecks()

	const onSuccess = async () => {
		await queryClient.invalidateQueries({
			queryKey: [EPISODE_LIST_QUERY_KEY, Number(id)],
			type: 'all',
			refetchType: 'active',
		})
	}

	const onError = (error: Error) => {
		toast.error(error.message)
	}

	const onSaveEpisode = useCallback(
		async ({
			text,
			status,
			chapterId,
			comments,
			prevProps,
			word_count,
			resolvedComments,
			language,
			newLLMMemories,
		}: TSaveEpisodeMutationArgs) => {
			if (
				status === BASE_STATUS &&
				language === ELanguage.GERMAN_ORIGINAL &&
				!updatedStatus
			) {
				setUpdatedStatus(true)
				await saveContent({
					episodeId: chapterId ?? Number(episodeId),
					projectId: Number(id),
					id: chapterId ?? Number(episodeId),
					text,
					status: EStatus.FIRST_DRAFT,
				})
			}
			return saveContent({
				episodeId: Number(episodeId),
				projectId: Number(id),
				text,
				id: chapterId ?? Number(episodeId),
				status:
					language === ELanguage.GERMAN_ORIGINAL
						? status === BASE_STATUS
							? EStatus.FIRST_DRAFT
							: status
						: BASE_STATUS,
				word_count,
				language,
				props: {
					...prevProps,
					llm_memories: {
						...(prevProps?.llm_memories ?? {}),
						...(newLLMMemories ?? {}),
					} as TEpisodeProps,
					comments,
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
		language,
	}: {
		chapter_title: string
		language?: ELanguage
		seq_number: number
	}) => {
		if (!id) {
			toast.error('Project ID not found!')
			return
		}
		return inventEpisode({
			project_id: Number(id),
			chapter_title,
			seq_number,
			language,
		})
	}

	const onStatusUpdate = async ({
		parent_id,
		status,
		language,
	}: {
		language?: ELanguage
		parent_id: number
		status: string
	}) => {
		if (!(isGerman || isOriginal)) {
			return
		}
		return updateStatus(Number(id), parent_id, status, language)
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
		onSuccess: (_, variable) => {
			void (async () => {
				await Promise.all([
					variable.seq_number === 1
						? queryClient.invalidateQueries({
								queryKey: [STORY_ID_QUERY_KEY, Number(id)],
							})
						: Promise.resolve(),
					onSuccess(),
				])
			})()
		},
	})

	const episodeDeleteMutation = useMutation({
		mutationKey: [EpisodeActions.DELETE, id],
		mutationFn: deleteEpisode,
		onSuccess,
	})

	const episodeMultipleDeleteMutation = useMutation({
		mutationKey: [EpisodeActions.DELETE, 'multiple'],
		mutationFn: (seq_nos: number[]) =>
			deleteMultipleEpisode({ project_id: Number(id), seq_nos }),
		onSuccess,
		onError,
	})

	const statusUpdateMutation = useMutation({
		mutationKey: [EpisodeActions.STATUS, id],
		mutationFn: onStatusUpdate,
		onSuccess,
	})

	useEffect(() => {
		setFullScreenLoading(
			(saveEpisodeMutation.isPending && !episodeId) ||
				episodesMergeMutation.isPending ||
				episodeUnmergeMutation.isPending ||
				episodeInventMutation.isPending ||
				episodeDeleteMutation.isPending ||
				episodeMultipleDeleteMutation.isPending
		)

		switch (true) {
			case episodeDeleteMutation.isPending:
				setFullScreenLoadingMessage('Deleting episode...')
				break
			case episodeMultipleDeleteMutation.isPending:
				setFullScreenLoadingMessage('Deleting multiple episodes...')
				break
			case episodeInventMutation.isPending:
				setFullScreenLoadingMessage('Inventing episode...')
				break
			case episodeUnmergeMutation.isPending:
				setFullScreenLoadingMessage('Unmerging episodes...')
				break
			case episodesMergeMutation.isPending:
				setFullScreenLoadingMessage('Merging episodes...')
				break
			case saveEpisodeMutation.isPending && !episodeId:
				setFullScreenLoadingMessage('Saving episode...')
				break
			default:
				setFullScreenLoadingMessage('')
		}
	}, [
		episodeDeleteMutation.isPending,
		episodeId,
		episodeInventMutation.isPending,
		episodeMultipleDeleteMutation.isPending,
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
		statusUpdateMutation,
		episodeMultipleDeleteMutation,
	}
}

export default useEpisodeHook

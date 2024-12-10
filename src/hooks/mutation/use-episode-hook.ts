'use client'

import { useCallback } from 'react'
import { useParams } from 'next/navigation'
import { saveContent } from '@/server-action/content-action'
import {
	deleteEpisode,
	inventEpisode,
	unmergeEpisodes,
} from '@/server-action/episode-action'
import { useEpisodeStore } from '@/store/episode-store'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { TComment } from '@udecode/plate-comments'

import { BASE_STATUS, EStatus } from '@/types/common'
import { TEpisodeMergeParams } from '@/types/episode-type'

import useSocket from '../use-socket'

const useEpisodeHook = () => {
	const { id, episodeId } = useParams()
	const { startTask, getResponse } = useSocket()

	const queryClient = useQueryClient()

	const { currentPage, episodeSearch } = useEpisodeStore()

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

	const saveEpisodeMutation = useMutation({
		mutationKey: ['save', id, episodeId],
		mutationFn: onSaveEpisode,
	})

	const episodesMergeMutation = useMutation({
		mutationKey: ['merge', id],
		mutationFn: onEpisodeMerge,
		onSuccess,
	})

	const episodeUnmergeMutation = useMutation({
		mutationKey: ['unmerge', id],
		mutationFn: unmergeEpisodes,
		onSuccess,
	})

	const episodeInventMutation = useMutation({
		mutationKey: ['invent', id],
		mutationFn: onEpisodeInvent,
		onSuccess,
	})

	const episodeDeleteMutation = useMutation({
		mutationKey: ['delete', id],
		mutationFn: deleteEpisode,
		onSuccess,
	})

	return {
		saveEpisodeMutation,
		episodesMergeMutation,
		episodeUnmergeMutation,
		episodeInventMutation,
		episodeDeleteMutation,
	}
}

export default useEpisodeHook

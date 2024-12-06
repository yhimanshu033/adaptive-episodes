'use client'

import { useCallback } from 'react'
import { revalidatePath } from 'next/cache'
import { useParams } from 'next/navigation'
import { saveContent } from '@/server-action/content-action'
import {
	deleteEpisode,
	inventEpisode,
	unmergeEpisodes,
} from '@/server-action/episode-action'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { TComment } from '@udecode/plate-comments'

import { BASE_STATUS, EStatus } from '@/types/common'
import { TEpisodeMergeParams } from '@/types/episode-type'

import useEpisodeContent from '../query/use-episode-content'
import useSocket from '../use-socket'

const useEpisodeHook = () => {
	const { id, episodeId } = useParams()
	const { data } = useEpisodeContent()
	const status = data?.chapter.status || BASE_STATUS
	const chapterId = data?.chapter.parent || Number(episodeId)

	const { startTask, getResponse } = useSocket()

	const queryClient = useQueryClient()

	const onSuccess = async () => {
		revalidatePath('/projects/[id]', 'page')
		await queryClient.invalidateQueries({ queryKey: ['episodes'], type: 'all' })
		window.location.reload()
	}

	const onSaveEpisode = useCallback(
		({
			text,
			statusChange,
			selectedChapterId,
			selectedProjectId,
			chapter_title,
			comments,
		}: {
			chapter_title?: string
			comments?: TComment[]
			selectedChapterId?: number
			selectedProjectId?: number
			statusChange?: EStatus
			text: string
		}) => {
			return saveContent({
				episodeId: selectedChapterId || chapterId,
				projectId: selectedProjectId || Number(id),
				text,
				status:
					statusChange ||
					(status === BASE_STATUS ? EStatus.FIRST_DRAFT : status),
				chapter_title,
				props: {
					comments,
				},
			})
		},
		[chapterId, id, status]
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
		mutationKey: ['save', id, chapterId],
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

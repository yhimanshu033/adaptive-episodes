import { useMemo } from 'react'
import { useParams } from 'next/navigation'
import { getMetadata } from '@/server-action/metadata-action'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useCommentItemContentState } from '@udecode/plate-comments/react'
import { useEditorState } from '@udecode/plate-common/react'

import getMetaDataRange from '@/lib/get-metadta-range'
import { extractFromMetadata, getText } from '@/lib/utils'

import { CommentExampleParams } from '@/types/ai-types'

import useEpisodeContent from '../query/use-episode-content'
import { useStoriesData } from '../query/use-story-data'
import useSocketStreaming from '../use-socket-streaming'

export default function useCommentExampleHook() {
	const { comment, commentText } = useCommentItemContentState()

	const { id } = useParams()
	const { startTask } = useSocketStreaming()
	const { data: episodeContent } = useEpisodeContent()
	const { data: stories } = useStoriesData()
	const { children } = useEditorState()
	const episodesCount = useMemo(() => {
		return stories?.find((data) => data?.id === Number(id))?.episode_count || 0
	}, [stories, id])

	const [start, end] = getMetaDataRange(
		episodeContent?.chapter.seq_number || 0,
		episodesCount
	)
	const { data: metadata } = useQuery({
		queryKey: ['metadata', id, start, end],
		queryFn: () => getMetadata(Number(id), Math.max(start - 1, 1), end),
	})

	const commentExampleMutation = async () => {
		if (!metadata?.data) return ''
		const extractedData = extractFromMetadata(metadata.data, start)

		const taskId = await startTask<CommentExampleParams>({
			method: 'POST',
			url: '/review/example/',
			body: {
				comment: getText(comment.value),
				ep_text: getText(children),
				highlighted_text: commentText || '',
				...extractedData,
			},
		})
		return taskId
	}

	const mutation = useMutation({
		mutationKey: ['comment-example', comment.id],
		mutationFn: commentExampleMutation,
	})

	return mutation
}

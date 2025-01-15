import { AI_USER_ID } from '@/constants/ai-constants'
import { useMutation } from '@tanstack/react-query'
import {
	CommentsPlugin,
	useCommentItemContentState,
} from '@udecode/plate-comments/react'
import {
	ParagraphPlugin,
	useEditorPlugin,
	useEditorState,
} from '@udecode/plate-common/react'

import { getCommentNode, getText } from '@/lib/utils'

import { CommentExampleParams } from '@/types/ai-types'

import useEpisodeContent from '../query/use-episode-content'
import useSocketStreaming from '../use-socket-streaming'

export default function useCommentExampleHook() {
	const { comment } = useCommentItemContentState()
	const { startTask } = useSocketStreaming()
	const { data: episodeContent } = useEpisodeContent()
	const { children } = useEditorState()
	const { api } = useEditorPlugin(CommentsPlugin)

	const commentExampleMutation = async () => {
		const { beforeText, afterText, text } = getCommentNode(
			children,
			`comment_${comment.id}`
		)

		const prev_paragraphs =
			beforeText.split(/\n+/).length > 2
				? beforeText.split(/\n+/).slice(-3).join('\n')
				: beforeText

		const next_paragraphs =
			afterText.split(/\n+/).length > 2
				? afterText.split(/\n+/).slice(0, 3).join('\n')
				: afterText

		const taskId = await startTask<CommentExampleParams, string[]>({
			method: 'POST',
			url: '/aicopilot/review-example',
			body: {
				comment: getText(comment.value),
				highlighted_text: text,
				prev_paragraphs,
				next_paragraphs,
				context: episodeContent?.chapter?.props?.llm_memories?.context || '',
			},
			onResponse: (resp?: string[]) => {
				if (!resp?.length) return
				api.comment.addComment({
					value: [
						{
							type: ParagraphPlugin.key,
							children: [
								{
									text: 'Beispiel:\n\n' + resp.join(''),
								},
							],
						},
					],
					userId: AI_USER_ID,
					createdAt: Date.now(),
					parentId: comment.id,
				})
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

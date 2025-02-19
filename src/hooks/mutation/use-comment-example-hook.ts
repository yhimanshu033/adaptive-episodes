import { AI_USER_ID } from '@/constants/ai-constants'
import { API_URLS } from '@/constants/global-constants'
import useEpisodeContent from '@/hooks/query/use-episode-content'
import useSocketStreaming from '@/hooks/use-socket-streaming'
import useAIStore from '@/store/ai-store'
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

import { getCommentNode, getText } from '@/lib/utils/plate'

import { CommentExampleParams } from '@/types/ai-types'

export default function useCommentExampleHook() {
	const { comment } = useCommentItemContentState()
	const { startTask } = useSocketStreaming()
	const { data: episodeContent } = useEpisodeContent()
	const { children } = useEditorState()
	const { api } = useEditorPlugin(CommentsPlugin)

	const { removeActiveCommentExampleMap } = useAIStore()
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
			url: API_URLS.STREAM_COMMENT_EXAMPLE,
			body: {
				comment: getText(comment.value),
				highlighted_text: text,
				prev_paragraphs,
				next_paragraphs,
				context: episodeContent?.chapter?.props?.llm_memories?.context || '',
			},
			onResponse: (resp?: string[]) => {
				if (!resp?.length) return
				removeActiveCommentExampleMap(comment.id)
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
			noCache: true,
		})
		return taskId
	}

	const mutation = useMutation({
		mutationKey: ['comment-example', comment.id],
		mutationFn: commentExampleMutation,
	})

	return mutation
}

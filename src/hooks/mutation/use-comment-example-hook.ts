import { useMutation } from '@tanstack/react-query'
import { useCommentItemContentState } from '@udecode/plate-comments/react'
import { useEditorState } from '@udecode/plate-common/react'

import { getCommentNode, getText } from '@/lib/utils'

import { CommentExampleParams } from '@/types/ai-types'

import useEpisodeContent from '../query/use-episode-content'
import useSocketStreaming from '../use-socket-streaming'

export default function useCommentExampleHook() {
	const { comment } = useCommentItemContentState()
	const { startTask } = useSocketStreaming()
	const { data: episodeContent } = useEpisodeContent()
	const { children } = useEditorState()

	console.log({ e: episodeContent?.chapter })
	const commentExampleMutation = async () => {
		const { beforeText, afterText, text } = getCommentNode(
			children,
			`comment_${comment.id}`
		)

		const prev_paragraphs =
			beforeText.split(/\n+/).length > 2
				? beforeText.split(/\n+/).slice(-3).join('\n')
				: beforeText

		console.log({
			a: afterText.split(/\n+/),
			b: beforeText.split(/\n+/),
		})
		const next_paragraphs =
			afterText.split(/\n+/).length > 2
				? afterText.split(/\n+/).slice(0, 3).join('\n')
				: afterText

		console.log({
			body: {
				comment: getText(comment.value),
				ep_text: getText(children),
				commented_text: text,
				prev_paragraphs,
				next_paragraphs,
				context: episodeContent?.chapter?.props?.llm_memories?.context || '',
			},
		})
		return ''
		const taskId = await startTask<CommentExampleParams>({
			method: 'POST',
			url: '/review/example/',
			body: {
				comment: getText(comment.value),
				ep_text: getText(children),
				commented_text: text,
				prev_paragraphs,
				next_paragraphs,
				context: episodeContent?.chapter?.props?.llm_memories?.context || '',
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

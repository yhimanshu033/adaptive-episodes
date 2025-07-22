import { AI_USER_ID } from '@/constants/ai-constants'
import { languageToTitle } from '@/constants/episodes-constants'
import { API_URLS } from '@/constants/global-constants'
import useEpisodeContent from '@/hooks/query/use-episode-content'
import useLanguage from '@/hooks/use-language'
import useSocketStreaming from '@/hooks/use-socket-streaming'
import useAIStore from '@/store/ai-store'
import { useMutation } from '@tanstack/react-query'
import { KEYS, Value } from 'platejs'
import { useEditorRef } from 'platejs/react'

import { discussionPlugin } from '@/components/editor/plugins/discussion-kit'
import { TComment } from '@/components/plate-ui-v2/comment'
import { getCommentNode, getText } from '@/lib/utils/plate'

import { CommentExampleParams } from '@/types/ai-types'

export default function useCommentExampleHook(comment: TComment) {
	const { startTask } = useSocketStreaming()
	const { data: episodeContent } = useEpisodeContent()
	const editor = useEditorRef()

	const { removeActiveCommentExampleMap } = useAIStore()
	const language = useLanguage()

	const commentExampleMutation = async () => {
		const { beforeText, afterText, text } = getCommentNode(
			editor.children,
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
				comment: getText(comment.contentRich),
				highlighted_text: text,
				prev_paragraphs,
				next_paragraphs,
				context: episodeContent?.chapter?.props?.llm_memories?.context || '',
				input_language: languageToTitle[language],
			},
			onResponse: (resp?: string[]) => {
				if (!resp?.length) {
					return
				}
				const commentValue: Value = [
					{
						type: KEYS.p,
						children: [
							{
								text: 'Example:\n\n' + resp.join(''),
							},
						],
					},
				]
				removeActiveCommentExampleMap(comment.id)
				editor
					.getApi(discussionPlugin)
					.discussion.addToReplies(
						comment.discussionId,
						commentValue,
						AI_USER_ID
					)
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

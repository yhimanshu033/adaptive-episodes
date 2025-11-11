import { useParams } from 'next/navigation'
import { API_URLS } from '@/constants/global-constants'
import useEpisodeContent from '@/hooks/query/use-episode-content'
import useSocketStreaming from '@/hooks/use-socket-streaming'
import {
	EOutlinerChatAction,
	EOutlinerHighlightedMode,
	EOutlinerMode,
	TOutlinerChatbotRequestBody,
	TOutlinerData,
	TOutlinerTabData,
} from '@/page-builders/plate-editor/sidebar-sections/outliner/lib/types'
import { useMutation } from '@tanstack/react-query'

import { getSimplifiedMessageList } from '@/lib/utils/helpers'

import { TMessage } from '@/types/ai-types'
import { ELanguage } from '@/types/common'

export default function useOutlinerChat() {
	const { id } = useParams()
	const { data } = useEpisodeContent()
	const { startTask, responses } = useSocketStreaming()
	async function sendOutlinerChat({
		outlinerData,
		selection,
		prompt,
		epText,
		mode,
		action,
		retry = true,
		messages,
		previous_episode_context,
		previous_episode_summary,
	}: {
		action?: EOutlinerChatAction
		epText: string
		messages: TMessage[]
		mode: EOutlinerMode
		outlinerData?: TOutlinerData
		prompt: string
		retry?: boolean
		selection?: TOutlinerTabData
	} & Pick<
		TOutlinerChatbotRequestBody,
		'previous_episode_context' | 'previous_episode_summary'
	>) {
		const taskId = await startTask<TOutlinerChatbotRequestBody>({
			method: 'POST',
			url: API_URLS.OUTLINER_CHAT,
			body: {
				project_id: Number(id),
				ep_number: data?.chapter?.seq_number || 0,
				current_episode_context:
					data?.chapter?.props?.llm_memories?.context || '',
				current_episode_summary:
					outlinerData?.[1]?.summary ||
					outlinerData?.[1]?.multiSelectOptions?.[
						outlinerData?.[1]?.multiSelectSelectedOption || 0
					]?.summary ||
					'',
				narrative_arc_plan: outlinerData?.[2]?.summary || '',
				ep_text: epText,
				input_language: data?.chapter?.language || ELanguage.ENGLISH,
				mode,
				user_prompt: prompt,
				action,
				highlighted_mode:
					selection?.sceneIdx !== undefined
						? undefined
						: selection?.summaryIdx === 1
							? EOutlinerHighlightedMode.CURRENT_EP_SUMMARY
							: selection?.summaryIdx === 2
								? EOutlinerHighlightedMode.NARRATIVE_ARCS_PLAN
								: undefined,
				chat_history: getSimplifiedMessageList({
					messages: messages.slice(0, 10),
					responses: responses,
				}),
				previous_episode_context,
				previous_episode_summary,
				scenes: outlinerData?.[1]?.scenes || [],
			},
			noCache: retry,
		})

		return taskId
	}
	const mutation = useMutation({
		mutationKey: ['outliner-chat', id, data?.chapter?.seq_number],
		mutationFn: sendOutlinerChat,
	})

	return mutation
}

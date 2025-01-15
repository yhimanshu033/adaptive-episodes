'use client'

import { useParams } from 'next/navigation'
import useSocketStreaming from '@/hooks/use-socket-streaming'
import { getMetadata } from '@/server-action/metadata-action'
import { useMutation } from '@tanstack/react-query'

import { extractFromMetadata } from '@/lib/utils/ai-chatbot'
import { getMetaDataRange } from '@/lib/utils/helpers'

import { AIChatBotParams } from '@/types/ai-types'

const useAIChatbotHook = () => {
	const { id } = useParams()
	const { startTask } = useSocketStreaming()

	const onAiChatbotMutation = async (params: AIChatBotParams) => {
		const [start, end] = getMetaDataRange(
			params.episodeNumber,
			params.episodesCount
		)
		const { data: metadata } = await getMetadata(
			Number(id),
			Math.max(start, 1),
			end
		)
		const extractedData = extractFromMetadata(metadata, start)

		const taskId = await startTask<AIChatBotParams['aiChatbotData']>({
			method: 'POST',
			url: '/aicopilot/chatbot',
			body: {
				...params.aiChatbotData,
				...extractedData,
			},
		})
		return taskId
	}

	const aiChatbotMutation = useMutation({
		mutationKey: ['chatbot'],
		mutationFn: onAiChatbotMutation,
	})
	return { aiChatbotMutation }
}
export default useAIChatbotHook

'use client'

import { useParams } from 'next/navigation'
import { getMetadata } from '@/server-action/metadata-action'
import { useMutation } from '@tanstack/react-query'

import getMetaDataRange from '@/lib/get-metadta-range'
import { extractFromMetadata } from '@/lib/utils'

import { AIChatBotParams } from '@/types/ai-types'

import useSocketStreaming from '../use-socket-streaming'

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

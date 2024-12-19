'use client'

import { useParams } from 'next/navigation'
import useSocket from '@/hooks/use-socket'
import { getMetadata } from '@/server-action/metadata-action'
import { useMutation } from '@tanstack/react-query'

import getMetaDataRange from '@/lib/get-metadta-range'
import { extractFromMetadata } from '@/lib/utils'

import { AIChatBotParams } from '@/types/ai-types'

const useAIChatbotHook = () => {
	const { id } = useParams()
	const { startTask, getResponse } = useSocket()

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

		console.log('Request Body', {
			...params.aiChatbotData,
			...extractedData,
		})
		const taskId = await startTask<AIChatBotParams['aiChatbotData']>({
			method: 'POST',
			url: '/aicopilot/chatbot',
			body: {
				...params.aiChatbotData,
				...extractedData,
			},
		})
		return getResponse(taskId)
	}

	const aiChatbotMutation = useMutation({
		mutationKey: ['chatbot'],
		mutationFn: onAiChatbotMutation,
	})
	return { aiChatbotMutation }
}
export default useAIChatbotHook

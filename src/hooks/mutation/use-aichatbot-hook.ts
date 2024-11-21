'use client'

import { useParams } from 'next/navigation'
import useSocket from '@/hooks/use-socket'
import { getMetadata } from '@/server-action/metadata-action'
import { useMutation } from '@tanstack/react-query'

import getMetaDataRange from '@/lib/get-metadta-range'

import { AIChatBotParams } from '@/types/ai-types'
import { TGetMetadataResponse } from '@/types/content-types'

export const extractFromMetadata = (
	metadata: TGetMetadataResponse | null,
	start: number
) => {
	const loglines_array: string[] = []
	const beatsheets_array: string[] = []
	let context: string = ''
	let current = start + 1

	if (metadata?.data) {
		const metadataEntries = Object.values(metadata?.data)

		if (start) {
			context = metadataEntries[0].context
		}

		for (const data of Object.values(metadata.data).slice(start ? 1 : 0)) {
			loglines_array.push(`Ep${current} ${data.loglines}`)
			beatsheets_array.push(`Ep${current} ${data.beatsheet}`)
			current++
		}
	}
	return { loglines_array, beatsheets_array, context }
}

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

		const taskId = await startTask<AIChatBotParams['aiChatbotData']>({
			method: 'POST',
			url: '/aicopilot/chatbot',
			body: {
				...params.aiChatbotData,
				...extractedData,
			},
		})
		return await getResponse(taskId)
	}

	const aiChatbotMutation = useMutation({
		mutationKey: ['chatbot'],
		mutationFn: onAiChatbotMutation,
	})
	return { aiChatbotMutation }
}
export default useAIChatbotHook

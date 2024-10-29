'use client'

import { useParams } from 'next/navigation'
import { getChatbotResponse } from '@/server-action/ai-action'
import { getMetadata } from '@/server-action/metadata-action'
import { useMutation } from '@tanstack/react-query'

import getMetaDataRange from '@/lib/get-metadta-range'

import { AIChatBotParams } from '@/types/ai-types'

const useAIChatbotHook = () => {
	const { id } = useParams()

	const onAiChatbotMutation = async (params: AIChatBotParams) => {
		const [start, end] = getMetaDataRange(
			params.episodeNumber,
			params.episodesCount
		)
		const { metadata, previousEpisodeContext } = await getMetadata(
			id as string,
			start,
			end
		)
		const { loglines_array, beatsheets_array } = metadata.reduce<{
			beatsheets_array: string[]
			loglines_array: string[]
		}>(
			(acc, data) => {
				acc.loglines_array.push(data.loglines)
				acc.beatsheets_array.push(data.beatsheets)
				return acc
			},
			{ loglines_array: [], beatsheets_array: [] }
		)
		return getChatbotResponse({
			...params.aiChatbotData,
			loglines_array,
			beatsheets_array,
			context: previousEpisodeContext || '',
		})
	}

	const aiChatbotMutation = useMutation({
		mutationKey: ['chatbot'],
		mutationFn: onAiChatbotMutation,
	})
	return { aiChatbotMutation }
}
export default useAIChatbotHook

'use client'

import { useParams } from 'next/navigation'
import { getChatbotResponse } from '@/server-action/ai-action'
import { getMetadata } from '@/server-action/episode-action'
import { useMutation } from '@tanstack/react-query'

import getMetaDataRange from '@/lib/get-metadta-range'

import { AIChatBotParams } from '@/types/ai-types'

import useEpisodeData from '../query/use-episode-data'

const useAIChatbotHook = () => {
	const { data: episodeData } = useEpisodeData()
	const { id, episodeId } = useParams()

	const onAiChatbotMutation = async (params: AIChatBotParams) => {
		const [start, end] = getMetaDataRange(
			parseInt(episodeId as string),
			episodeData?.totalEpisodes || 0
		)
		const { metadata } = await getMetadata(
			id as string,
			episodeId as string,
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
		return getChatbotResponse({ ...params, loglines_array, beatsheets_array })
	}

	const aiChatbotMutation = useMutation({
		mutationKey: ['chatbot'],
		mutationFn: onAiChatbotMutation,
	})
	return { aiChatbotMutation }
}
export default useAIChatbotHook

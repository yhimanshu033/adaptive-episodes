'use client'

import { useParams } from 'next/navigation'
import { languageToTitle } from '@/constants/episodes-constants'
import { API_URLS } from '@/constants/global-constants'
import useMetadataQuery from '@/hooks/query/use-metadata-query'
import useLanguage from '@/hooks/use-language'
import useSocketStreaming from '@/hooks/use-socket-streaming'
import useAIStore from '@/store/ai-store'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useShallow } from 'zustand/react/shallow'

import {
	extractFromMetadata,
	getStoryExplorerConfigArray,
} from '@/lib/utils/ai-chatbot'
import { getMetaDataRange } from '@/lib/utils/helpers'

import { AIChatbotHookParams, AIChatBotParams } from '@/types/ai-types'

const useAIChatbotHook = ({
	episodeNumber,
	episodesCount,
}: AIChatbotHookParams) => {
	const { id } = useParams()
	const { startTask } = useSocketStreaming()
	const { store: useAIContextStore } = useAIStore()
	const storyExplorerConfiguration = useAIContextStore(
		useShallow((state) => state.storyExplorerConfiguration)
	)

	const [start, end] = getMetaDataRange(episodeNumber, episodesCount)
	const { data: metadataQueryData } = useMetadataQuery(start, end)

	const language = useLanguage()

	const onAiChatbotMutation = async (params: AIChatBotParams) => {
		if (!metadataQueryData?.data) {
			return
		}

		const { data: metadata } = metadataQueryData
		const { beatsheets_array, loglines_array } = extractFromMetadata(metadata)
		const sources = getStoryExplorerConfigArray(storyExplorerConfiguration)

		const taskId = await startTask<AIChatBotParams['aiChatbotData']>({
			method: 'POST',
			url: API_URLS.STREAM_CHATBOT,
			body: {
				project_id: Number(id),
				...params.aiChatbotData,
				sources,
				beatsheets_array,
				loglines_array,
				input_language: languageToTitle[language],
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

export const useAIChatbotQueryHook = (
	params: AIChatBotParams & AIChatbotHookParams
) => {
	const { id } = useParams()
	const { startTask } = useSocketStreaming()

	const [start, end] = getMetaDataRange(
		params.episodeNumber,
		params.episodesCount
	)
	const { data: metadataQueryData } = useMetadataQuery(start, end)

	const language = useLanguage()

	const getChatbotResponse = async () => {
		if (!metadataQueryData?.data) {
			return
		}

		const { data: metadata } = metadataQueryData

		const { beatsheets_array, loglines_array } = extractFromMetadata(metadata)

		const taskId = await startTask<AIChatBotParams['aiChatbotData']>({
			method: 'POST',
			url: API_URLS.STREAM_CHATBOT,
			body: {
				project_id: Number(id),
				...params.aiChatbotData,
				beatsheets_array,
				loglines_array,
				input_language: languageToTitle[language],
			},
		})
		return taskId
	}

	const query = useQuery({
		queryKey: [
			'chatbot',
			params.episodesCount,
			params.episodesCount,
			params.aiChatbotData.chat_mode,
			params.aiChatbotData.user_message,
		],
		queryFn: getChatbotResponse,
		enabled: !!metadataQueryData?.data?.data,
		gcTime: 0,
		staleTime: 0,
	})
	return query
}
export default useAIChatbotHook

'use client'

import { useParams } from 'next/navigation'
import useMetadataQuery from '@/hooks/query/use-metadata-query'
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
	const { data: metadataQueryData } = useMetadataQuery(Math.max(start, 1), end)

	const onAiChatbotMutation = async (params: AIChatBotParams) => {
		if (!metadataQueryData?.data) return

		const { data: metadata } = metadataQueryData
		const extractedData = extractFromMetadata(metadata, start)
		const sources = getStoryExplorerConfigArray(storyExplorerConfiguration)
		const taskId = await startTask<AIChatBotParams['aiChatbotData']>({
			method: 'POST',
			url: '/aicopilot/chatbot',
			body: {
				project_id: Number(id),
				...params.aiChatbotData,
				sources,
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

export const useAIChatbotQueryHook = (
	params: AIChatBotParams & AIChatbotHookParams
) => {
	const { id } = useParams()
	const { startTask } = useSocketStreaming()

	const [start, end] = getMetaDataRange(
		params.episodeNumber,
		params.episodesCount
	)
	const { data: metadataQueryData } = useMetadataQuery(Math.max(start, 1), end)

	const getChatbotResponse = async () => {
		if (!metadataQueryData?.data) return

		const { data: metadata } = metadataQueryData

		const extractedData = extractFromMetadata(metadata, start)

		const taskId = await startTask<AIChatBotParams['aiChatbotData']>({
			method: 'POST',
			url: '/aicopilot/chatbot',
			body: {
				project_id: Number(id),
				...params.aiChatbotData,
				...extractedData,
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

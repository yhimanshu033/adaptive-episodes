'use client'

import { useParams } from 'next/navigation'
import { getChatbotResponseTest } from '@/server-action/ai-action'
import { getMetadata } from '@/server-action/metadata-action'
import { useMutation } from '@tanstack/react-query'
import { useEditorState } from '@udecode/plate-common/react'

import getMetaDataRange from '@/lib/get-metadta-range'
import { minify } from '@/lib/utils'

import { AIChatBotParams } from '@/types/ai-types'

import { extractFromMetadata } from './use-aichatbot-hook'

const useAIChatbotHookTest = () => {
	const { id } = useParams()
	const { children } = useEditorState()
	const minifiedValue = minify(children)

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
		return getChatbotResponseTest({
			...params.aiChatbotData,
			...extractedData,
			ep_text_json: minifiedValue.slice(0, 3),
		})
	}

	const aiChatbotMutationTest = useMutation({
		mutationKey: ['chatbot'],
		mutationFn: onAiChatbotMutation,
	})
	return { aiChatbotMutationTest, children }
}
export default useAIChatbotHookTest

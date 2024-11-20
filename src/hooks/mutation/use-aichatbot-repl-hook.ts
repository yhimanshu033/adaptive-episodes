'use client'

import { useParams } from 'next/navigation'
import { getChatbotResponseTest } from '@/server-action/ai-action'
import { getMetadata } from '@/server-action/metadata-action'
import { useMutation } from '@tanstack/react-query'
import { useEditorState } from '@udecode/plate-common/react'

import getMetaDataRange from '@/lib/get-metadta-range'
import { minify } from '@/lib/utils'

import { AIChatBotParams } from '@/types/ai-types'

const useAIChatbotHookTest = () => {
	const { id } = useParams()
	const { children } = useEditorState()
	const minifiedValue = minify(children)

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
		let current = start
		const { loglines_array, beatsheets_array } = metadata.reduce<{
			beatsheets_array: string[]
			loglines_array: string[]
		}>(
			(acc, data) => {
				acc.loglines_array.push(`Ep${current} ${data.loglines}`)
				acc.beatsheets_array.push(`Ep${current} ${data.beatsheets}`)
				current++
				return acc
			},
			{ loglines_array: [], beatsheets_array: [] }
		)
		return getChatbotResponseTest({
			...params.aiChatbotData,
			loglines_array,
			beatsheets_array,
			context: previousEpisodeContext || '',
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

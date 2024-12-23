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
		return [
			{
				id: '0_0',
				comment:
					'Diese Reaktion von Alex wirkt etwas zu schnell und oberflächlich. Um mehr emotionale Tiefe zu erzeugen, könnte man seine inneren Konflikte stärker herausarbeiten. Vielleicht fühlt er sich erleichtert, aber gleichzeitig auch verletzt oder unsicher? </comment_format> <comment_format>',
				path: {
					start: 10,
					end: 15,
				},
			},
			{
				id: '0_0',
				comment:
					"Dieser Satz könnte subtiler formuliert werden, um Alex' wahre finanzielle Situation nicht zu offensichtlich zu machen. Stattdessen könnte er etwas Zweideutiges sagen, das sowohl als Scherz als auch als ernsthafte Absicht interpretiert werden kann. </comment_format> <comment_format>",
				path: {
					start: 20,
					end: 36,
				},
			},
			{
				id: '0_0',
				comment:
					'Suzans Charakter wird hier sehr eindimensional und negativ dargestellt. Um mehr Spannung und Komplexität zu erzeugen, könnten Sie ihre Motivation hinterfragen oder andeuten, dass hinter ihrer oberflächlichen Fassade mehr steckt. Dies würde den Leser dazu bringen, ihr Verhalten zu hinterfragen und die Dynamik zwischen den Charakteren interessanter gestalten. </comment_format>',
				path: {
					start: 45,
					end: 60,
				},
			},
		]
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

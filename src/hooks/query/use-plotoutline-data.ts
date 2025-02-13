'use client'

import { useCallback } from 'react'
import { useParams } from 'next/navigation'
import {
	ExplorerModeId,
	PlotAction,
} from '@/constants/story-explorer-constants'
import useSocketStreaming from '@/hooks/use-socket-streaming'
import { getMetadata } from '@/server-action/metadata-action'
import { useQuery } from '@tanstack/react-query'
import { useEditorState } from '@udecode/plate-common/react'

import useEpisodeId from '@/providers/episode-id-provider'
import {
	extractFromMetadata,
	extractScenesFromBeatsheet,
} from '@/lib/utils/ai-chatbot'
import { getText } from '@/lib/utils/plate'

import { PlotExplorerParams, PlotExplorerQueryResponse } from '@/types/ai-types'

const usePlotOutlineQuery = ({
	action,
	instruction,
	start,
	end,
	activeExplorerMode,
}: {
	action: string | null
	activeExplorerMode: ExplorerModeId
	end: number
	instruction: string
	start: number
}) => {
	const { startTask } = useSocketStreaming()
	const { id } = useParams()
	const episodeId = useEpisodeId()
	const { children } = useEditorState()

	const { data: metadata, isLoading: isMetadataLoading } = useQuery({
		queryKey: ['metadata', id, start, end],
		queryFn: () => getMetadata(Number(id), Math.max(start - 1, 1), end),
		staleTime: Infinity,
	})

	const getPlotOutline =
		useCallback(async (): Promise<PlotExplorerQueryResponse> => {
			if (!action) return { content: [], taskId: '' }
			const metadataEntries = Object.values(metadata?.data?.data || {})

			if ((action as PlotAction) === PlotAction.Summary) {
				return {
					content: metadataEntries
						.slice(start > 1 ? 1 : 0)
						.map((data, index) => ({
							title: `${index + start}. ${data.chapter_title || ''}`,
							preContent: `Synopsis:\n${data?.loglines?.replace(/\d+:/, '') || 'No data found 😢'}`,
							content: [
								{
									title: 'Summary',
									content: data.summary,
								},
							],
						})),
					taskId: '',
				}
			} else if ((action as PlotAction) === PlotAction.Scenes) {
				return {
					content: metadataEntries
						.slice(start > 1 ? 1 : 0)
						.map((data, index) => {
							return {
								title: `${index + start}. ${data.chapter_title || ''}`,
								content: extractScenesFromBeatsheet(data.beatsheet),
							}
						}),
					taskId: '',
				}
			}
			const { beatsheets_array: beatsheet_array, ...extractedData } =
				extractFromMetadata(metadata?.data, start - 1)
			const params: PlotExplorerParams = {
				project_id: Number(id),
				action,
				ep_from: start,
				ep_to: end,
				mode: activeExplorerMode,
				ep_number: String(episodeId),
				beatsheet_array,
				...extractedData,
				current_ep: getText(children) || ' ',
				instruction,
			}
			const taskId = await startTask({
				method: 'POST',
				url: '/aicopilot/explorer',
				body: params,
			})
			return {
				content: [],
				taskId,
			}
		}, [
			action,
			metadata?.data,
			start,
			id,
			end,
			activeExplorerMode,
			episodeId,
			children,
			instruction,
			startTask,
		])

	const plotOutlineQuery = useQuery({
		queryKey: [
			'plotoutline',
			episodeId,
			action,
			instruction,
			start,
			end,
			activeExplorerMode,
		],
		queryFn: getPlotOutline,
		staleTime: Infinity,
		enabled: !!(metadata?.data && action),
	})

	return {
		plotOutlineQuery,
		metadata: metadata?.data,
		isMetadataLoading,
	}
}

export default usePlotOutlineQuery

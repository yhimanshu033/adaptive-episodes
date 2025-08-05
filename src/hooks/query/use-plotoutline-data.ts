'use client'

import { useCallback } from 'react'
import { useParams } from 'next/navigation'
import { languageToTitle } from '@/constants/episodes-constants'
import { API_URLS } from '@/constants/global-constants'
import { PLOTOUTLINE_QUERY_KEY } from '@/constants/query-constants'
import {
	ExplorerModeId,
	PlotAction,
} from '@/constants/story-explorer-constants'
import useEditorData from '@/hooks/plate/use-editor-data'
import useMetadataQuery from '@/hooks/query/use-metadata-query'
import useLanguage from '@/hooks/use-language'
import useSocketStreaming from '@/hooks/use-socket-streaming'
import { useQuery } from '@tanstack/react-query'

import useEpisodeId from '@/providers/episode-id-provider'
import {
	extractFromMetadata,
	extractScenesFromBeatsheet,
} from '@/lib/utils/ai-chatbot'

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
	const { editorText } = useEditorData()

	const { data: metadata, isLoading: isMetadataLoading } = useMetadataQuery(
		start,
		end
	)

	const language = useLanguage()
	const getPlotOutline =
		useCallback(async (): Promise<PlotExplorerQueryResponse> => {
			if (!action) {
				return { content: [], taskId: '' }
			}
			const metadataEntries = Object.values(metadata?.data?.data || {})

			if ((action as PlotAction) === PlotAction.Summary) {
				return {
					content: metadataEntries.map((data, index) => ({
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
					content: metadataEntries.map((data, index) => {
						return {
							title: `${index + start}. ${data.chapter_title || ''}`,
							content: extractScenesFromBeatsheet(data.beatsheet),
						}
					}),
					taskId: '',
				}
			}
			const { beatsheets_array: beatsheet_array, ...extractedData } =
				extractFromMetadata(metadata?.data)
			const params: PlotExplorerParams = {
				project_id: Number(id),
				action,
				ep_from: start,
				ep_to: end,
				mode: activeExplorerMode,
				ep_number: String(episodeId),
				beatsheet_array,
				...extractedData,
				current_ep: editorText || ' ',
				search_query: instruction,
				input_language: languageToTitle[language],
			}

			const taskId = await startTask({
				method: 'POST',
				url: API_URLS.STREAM_EXPLORER,
				body: params,
			})
			return {
				content: [],
				taskId,
			}
		}, [
			action,
			metadata?.data,
			id,
			start,
			end,
			activeExplorerMode,
			episodeId,
			editorText,
			instruction,
			language,
			startTask,
		])

	const plotOutlineQuery = useQuery({
		queryKey: [
			PLOTOUTLINE_QUERY_KEY,
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

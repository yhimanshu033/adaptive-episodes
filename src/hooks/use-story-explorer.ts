import { useCallback, useEffect, useState } from 'react'
import {
	ExplorerModeId,
	PlotAction,
} from '@/constants/story-explorer-constants'
import usePlotOutlineHook from '@/hooks/mutation/use-plotoutline-hook'
import useSocketStreaming from '@/hooks/use-socket-streaming'
import useAIStore from '@/store/ai-store'
import { useEditorState } from '@udecode/plate-common/react'

import useEpisodeId from '@/providers/episode-id-provider'
import {
	extractFromMetadata,
	extractScenesFromBeatsheet,
} from '@/lib/utils/ai-chatbot'
import { parseOptimistically } from '@/lib/utils/helpers'
import { getText } from '@/lib/utils/plate'

import { ExplorerActionType, PlotExplorerApiResponse } from '@/types/ai-types'

export default function useStoryExplorer({
	start,
	end,
}: {
	end: number
	start: number
}) {
	const episodeId = useEpisodeId()
	const { store, setActiveExplorerMode, setActiveExplorerActions } =
		useAIStore()
	const activeExplorerMode = store((state) => state.activeExplorerMode)
	const activeExplorerActions = store((state) => state.activeExplorerActions)
	const currentAction = activeExplorerActions[activeExplorerMode]
	const [content, setContent] = useState<
		PlotExplorerApiResponse['data'] | undefined
	>([])
	const [promptInput, setPromptInput] = useState<string>('')
	const [taskId, setTaskId] = useState<string>('')
	const [isLoading, setLoading] = useState<boolean>(false)

	const { children } = useEditorState()
	const {
		plotlineMutation: { mutateAsync, reset },
		metadata,
		isMetadataLoading,
	} = usePlotOutlineHook({ start, end })

	const { responses, taskEnded } = useSocketStreaming()

	const handleTabChange = (mode: ExplorerModeId) => {
		if (mode === activeExplorerMode) return
		reset()
		setActiveExplorerMode(mode)
	}

	const handleRequest = useCallback(
		async (
			action: ExplorerActionType | string | null,
			instruction: string = ''
		) => {
			if (!action) return
			setLoading(true)
			setActiveExplorerActions(activeExplorerMode, action)
			const metadataEntries = Object.values(metadata?.data || {})

			setContent([])
			if ((action as PlotAction) === PlotAction.Summary) {
				setContent(
					metadataEntries.slice(start > 1 ? 1 : 0).map((data, index) => ({
						title: `${index + start}. ${data.chapter_title || ''}`,
						preContent: `Synopsis:\n${data?.loglines?.replace(/\d+:/, '') || 'No data found 😢'}`,
						content: [
							{
								title: 'Summary',
								content: data.summary,
							},
						],
					}))
				)
				setTaskId('')
			} else if ((action as PlotAction) === PlotAction.Scenes) {
				setContent(
					metadataEntries.slice(start > 1 ? 1 : 0).map((data, index) => {
						return {
							title: `${index + start}. ${data.chapter_title || ''}`,
							content: extractScenesFromBeatsheet(data.beatsheet),
						}
					})
				)
				setTaskId('')
			} else {
				const { beatsheets_array: beatsheet_array, ...extractedData } =
					extractFromMetadata(metadata, start - 1)
				const result = await mutateAsync({
					action,
					ep_from: start,
					ep_to: end,
					mode: activeExplorerMode,
					ep_number: String(episodeId),
					beatsheet_array,
					...extractedData,
					current_ep: getText(children) || ' ',
					instruction,
				})
				if (result) {
					setTaskId(result)
				}
			}
			setLoading(false)
		},
		[
			activeExplorerMode,
			metadata,
			mutateAsync,
			episodeId,
			children,
			start,
			end,
			setActiveExplorerActions,
		]
	)

	useEffect(() => {
		if (!taskId || isLoading) return
		if (responses[taskId]) {
			const jsonStr = responses[taskId].join('')
			const arrayStartIndex = jsonStr.indexOf('[')
			const cleanedJsonStr =
				arrayStartIndex !== -1 ? jsonStr.substring(arrayStartIndex) : '[]'
			try {
				const data =
					parseOptimistically<PlotExplorerApiResponse['data']>(cleanedJsonStr)
				if (!data) return
				setContent(data)
			} catch (error) {
				console.log(error)
			}
		}
		if (taskEnded[taskId]) {
			setTaskId('')
			return
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [taskId, responses[taskId], taskEnded[taskId], isLoading])

	useEffect(() => {
		if (!isMetadataLoading && currentAction && start && end) {
			void handleRequest(currentAction)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [start, end, currentAction, activeExplorerMode, isMetadataLoading])

	return {
		content,
		promptInput,
		setPromptInput,
		handleTabChange,
		activeExplorerMode,
		currentAction,
		isMetadataLoading,
		handleRequest,
		isTaskEnded: taskEnded[taskId],
	}
}

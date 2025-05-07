import { useCallback, useEffect, useState } from 'react'
import { ExplorerModeId } from '@/constants/story-explorer-constants'
import usePlotOutlineQuery from '@/hooks/query/use-plotoutline-data'
import useSocketStreaming from '@/hooks/use-socket-streaming'
import useAIStore from '@/store/ai-store'

import { parseOptimistically } from '@/lib/utils/helpers'

import { ExplorerActionType, PlotExplorerApiResponse } from '@/types/ai-types'

export default function useStoryExplorer({
	start,
	end,
}: {
	end: number
	start: number
}) {
	const {
		store,
		setActiveExplorerMode,
		setActiveExplorerActions,
		setInputFocus,
	} = useAIStore()
	const activeExplorerMode = store((state) => state.activeExplorerMode)
	const activeExplorerActions = store((state) => state.activeExplorerActions)
	const currentAction = activeExplorerActions[activeExplorerMode]
	const inputFocus = store((state) => state.inputFocus)
	const [content, setContent] = useState<
		PlotExplorerApiResponse['data'] | undefined
	>([])
	const [taskId, setTaskId] = useState<string>('')

	const {
		plotOutlineQuery: { data, isLoading, isFetching },
		isMetadataLoading,
	} = usePlotOutlineQuery({
		action: currentAction,
		instruction: inputFocus || '',
		end,
		start,
		activeExplorerMode,
	})

	const { responses, taskEnded } = useSocketStreaming()

	const handleTabChange = (mode: ExplorerModeId) => {
		if (mode === activeExplorerMode) {
			return
		}
		setActiveExplorerMode(mode)
	}

	const handleRequest = useCallback(
		(action: ExplorerActionType | string | null) => {
			if (!action) {
				return
			}
			setActiveExplorerActions(activeExplorerMode, action)
		},
		[activeExplorerMode, setActiveExplorerActions]
	)

	useEffect(() => {
		if (isFetching || !data) {
			setContent([])
			setTaskId('')
			return
		}
		if (data?.taskId) {
			setContent([])
			setTaskId(data.taskId)
			return
		}
		if (data?.content) {
			setContent(data.content)
			return
		}
		setContent([])
	}, [data, isFetching])

	useEffect(() => {
		if (!taskId || isLoading) {
			return
		}
		if (responses[taskId]) {
			const jsonStr = responses[taskId].join('')
			const arrayStartIndex = jsonStr.indexOf('[')
			const cleanedJsonStr =
				arrayStartIndex !== -1 ? jsonStr.substring(arrayStartIndex) : '[]'
			try {
				const data =
					parseOptimistically<PlotExplorerApiResponse['data']>(cleanedJsonStr)
				if (!data) {
					return
				}
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

	return {
		content,
		inputFocus,
		setInputFocus,
		handleTabChange,
		activeExplorerMode,
		currentAction,
		isMetadataLoading,
		handleRequest,
		isTaskEnded: taskEnded[taskId],
	}
}

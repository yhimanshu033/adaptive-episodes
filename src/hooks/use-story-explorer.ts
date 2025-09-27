import { useCallback, useEffect, useRef, useState } from 'react'
import { ExplorerModeId } from '@/constants/story-explorer-constants'
import usePlotOutlineQuery from '@/hooks/query/use-plotoutline-data'
import useCountdownTimer from '@/hooks/use-countdown-timer'
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

	const countdownStartedRef = useRef<Set<string>>(new Set())

	const {
		start: startCountdown,
		stop: stopCountdown,
		getTimeLeft,
	} = useCountdownTimer()

	const {
		plotOutlineQuery: {
			data,
			isLoading,
			isFetching,
			refetch: refetchPlotOutline,
		},
		isMetadataLoading,
	} = usePlotOutlineQuery({
		action: currentAction,
		instruction: inputFocus || '',
		end,
		start,
		activeExplorerMode,
	})

	const { responses, taskEnded, tasksTimedOut } = useSocketStreaming()

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

			if (!countdownStartedRef.current.has(data.taskId)) {
				startCountdown(data.taskId)
				countdownStartedRef.current.add(data.taskId)
			}
			return
		}
		if (data?.content) {
			setContent(data.content)
			return
		}
		setContent([])
	}, [data, isFetching, startCountdown])

	const taskResponses = responses[taskId]
	const isTaskEnded = taskEnded[taskId]

	useEffect(() => {
		if (!taskId || isLoading) {
			return
		}
		if (taskResponses) {
			if (countdownStartedRef.current.has(taskId)) {
				stopCountdown(taskId)
				countdownStartedRef.current.delete(taskId)
			}

			const jsonStr = taskResponses.join('')
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
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [
		taskId,
		taskResponses,
		isTaskEnded,
		isLoading,
		tasksTimedOut,
		stopCountdown,
	])

	return {
		content,
		inputFocus,
		setInputFocus,
		handleTabChange,
		activeExplorerMode,
		currentAction,
		isMetadataLoading,
		handleRequest,
		isTaskEnded,
		isTaskTimedOut: tasksTimedOut.has(taskId),
		refetchPlotOutline,
		getTimeLeft: (id?: string) => getTimeLeft(id || taskId),
		taskId,
	}
}

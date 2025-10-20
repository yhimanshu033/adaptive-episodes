import { useCallback, useEffect, useRef, useState } from 'react'
import { SOCKET_STREAMING_TIMEOUT } from '@/constants/global-constants'

export interface CountdownState {
	isRunning: boolean
	progress: number
	timeLeft: number
}

export interface CountdownControls {
	getProgress: (taskId?: string) => number
	getTimeLeft: (taskId?: string) => number
	isTaskRunning: (taskId: string) => boolean
	reset: () => void
	start: (taskId?: string, startTime?: number) => void
	stop: (taskId?: string) => void
}

/**
 * Custom hook for managing countdown timers that sync with socket streaming timeouts
 * Supports multiple concurrent countdowns for different tasks
 */
export const useCountdownTimer = (): CountdownState & CountdownControls => {
	const [timers, setTimers] = useState<Record<string, CountdownState>>({})
	const [globalTimer, setGlobalTimer] = useState<CountdownState>({
		timeLeft: 0,
		isRunning: false,
		progress: 0,
	})

	const intervalRefs = useRef<Record<string, NodeJS.Timeout>>({})
	const globalIntervalRef = useRef<NodeJS.Timeout | null>(null)

	const calculateProgress = useCallback((timeLeft: number): number => {
		const elapsed = SOCKET_STREAMING_TIMEOUT - timeLeft
		return Math.min(
			Math.max((elapsed / SOCKET_STREAMING_TIMEOUT) * 100, 0),
			100
		)
	}, [])

	const startTimer = useCallback(
		(taskId?: string, startTime: number = SOCKET_STREAMING_TIMEOUT) => {
			if (taskId && intervalRefs.current[taskId]) {
				clearInterval(intervalRefs.current[taskId])
			} else if (!taskId && globalIntervalRef.current) {
				clearInterval(globalIntervalRef.current)
			}

			const initialState: CountdownState = {
				timeLeft: startTime,
				isRunning: true,
				progress: 0,
			}

			if (taskId) {
				setTimers((prev) => ({
					...prev,
					[taskId]: initialState,
				}))
			} else {
				setGlobalTimer(initialState)
			}

			const interval = setInterval(() => {
				const updateTimer = (prevState: CountdownState): CountdownState => {
					const newTimeLeft = Math.max(prevState.timeLeft - 100, 0)
					const newProgress = calculateProgress(newTimeLeft)

					if (newTimeLeft <= 0) {
						if (taskId && intervalRefs.current[taskId]) {
							clearInterval(intervalRefs.current[taskId])
							delete intervalRefs.current[taskId]
						} else if (!taskId && globalIntervalRef.current) {
							clearInterval(globalIntervalRef.current)
							globalIntervalRef.current = null
						}

						return {
							timeLeft: 0,
							isRunning: false,
							progress: 100,
						}
					}

					return {
						timeLeft: newTimeLeft,
						isRunning: true,
						progress: newProgress,
					}
				}

				if (taskId) {
					setTimers((prev) => ({
						...prev,
						[taskId]: updateTimer(prev[taskId] || initialState),
					}))
				} else {
					setGlobalTimer(updateTimer)
				}
			}, 100)

			if (taskId) {
				intervalRefs.current[taskId] = interval
			} else {
				globalIntervalRef.current = interval
			}
		},
		[calculateProgress]
	)

	const stopTimer = useCallback((taskId?: string) => {
		if (taskId) {
			if (intervalRefs.current[taskId]) {
				clearInterval(intervalRefs.current[taskId])
				delete intervalRefs.current[taskId]
			}
			setTimers((prev) => {
				const updated = { ...prev }
				if (updated[taskId]) {
					updated[taskId] = {
						...updated[taskId],
						isRunning: false,
					}
				}
				return updated
			})
		} else {
			if (globalIntervalRef.current) {
				clearInterval(globalIntervalRef.current)
				globalIntervalRef.current = null
			}
			setGlobalTimer((prev) => ({
				...prev,
				isRunning: false,
			}))
		}
	}, [])

	const resetTimer = useCallback(() => {
		Object.values(intervalRefs.current).forEach(clearInterval)
		intervalRefs.current = {}

		if (globalIntervalRef.current) {
			clearInterval(globalIntervalRef.current)
			globalIntervalRef.current = null
		}

		setTimers({})
		setGlobalTimer({
			timeLeft: 0,
			isRunning: false,
			progress: 0,
		})
	}, [])

	const getTimeLeft = useCallback(
		(taskId?: string): number => {
			if (taskId) {
				return timers[taskId]?.timeLeft || 0
			}
			return globalTimer.timeLeft
		},
		[timers, globalTimer.timeLeft]
	)

	const getProgress = useCallback(
		(taskId?: string): number => {
			if (taskId) {
				return timers[taskId]?.progress || 0
			}
			return globalTimer.progress
		},
		[timers, globalTimer.progress]
	)

	const isTaskRunning = useCallback(
		(taskId: string): boolean => {
			return timers[taskId]?.isRunning || false
		},
		[timers]
	)

	useEffect(() => {
		return () => {
			Object.values(intervalRefs.current).forEach(clearInterval)
			if (globalIntervalRef.current) {
				clearInterval(globalIntervalRef.current)
			}
		}
	}, [])

	return {
		timeLeft: globalTimer.timeLeft,
		isRunning: globalTimer.isRunning,
		progress: globalTimer.progress,
		start: startTimer,
		stop: stopTimer,
		reset: resetTimer,
		getTimeLeft,
		getProgress,
		isTaskRunning,
	}
}

export default useCountdownTimer

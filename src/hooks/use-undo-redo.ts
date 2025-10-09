'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useDebounce } from '@/hooks/use-debounce'
import { isEqual } from 'lodash'

function isSameArray<T>(a: T, b: T) {
	if (!Array.isArray(a) || !Array.isArray(b)) {
		return false
	}
	if (a.length !== b.length) {
		return false
	}
	for (let i = 0; i < a.length; i++) {
		if (a[i] !== b[i]) {
			return false
		}
	}
	return true
}

type Options = {
	debounceMs?: number
	maxSquashCount?: number // how many same-order states to merge
	startIndex?: number
}

export function useUndoRedo<T>(state: T, options?: Options) {
	const {
		debounceMs = 400,
		maxSquashCount = 10,
		startIndex = 0,
	} = options || {}

	const [history, setHistory] = useState<T[]>([state])
	const [index, setIndex] = useState(0)
	const squashCounter = useRef(0)

	const debouncedState = useDebounce(state, debounceMs)
	const lastCheckedState = useRef<T>(state)
	const isUndoRedoClicked = useRef(false)

	const current = history[index]

	const initialData = useMemo(() => {
		return history[startIndex]
	}, [history, startIndex])

	// --- CORE: Push new state (with squash and truncation)
	const setNewState = useCallback(
		(newState: T) => {
			setHistory((prevHistory) => {
				const currentState = prevHistory[index]

				// squash if arrays are same order & length
				const shouldSquash =
					isSameArray(currentState, newState) &&
					squashCounter.current < maxSquashCount

				if (shouldSquash) {
					squashCounter.current += 1
					const nextHistory = [...prevHistory]
					nextHistory[index] = newState
					return nextHistory
				}

				squashCounter.current = 0

				// add a new entry, trimming any "future" history
				const nextHistory = prevHistory.slice(0, index + 1)
				nextHistory.push(newState)
				return nextHistory
			})

			setIndex((prev) => prev + 1)
		},
		[index, maxSquashCount]
	)

	// --- Effect: when debounced state changes, decide whether to push to history
	useEffect(() => {
		// skip if same as last checked state
		if (isEqual(debouncedState, lastCheckedState.current)) {
			return
		}

		// skip if undo/redo triggered this change
		if (isUndoRedoClicked.current) {
			isUndoRedoClicked.current = false
			lastCheckedState.current = debouncedState
			return
		}

		setNewState(debouncedState)
		lastCheckedState.current = debouncedState
	}, [debouncedState, setNewState])

	// --- Undo logic
	const undo = useCallback((): T => {
		squashCounter.current = 0
		const newIndex = Math.max(index - 1, startIndex)
		setIndex(newIndex)
		isUndoRedoClicked.current = true
		return history[newIndex]
	}, [history, index, startIndex])

	// --- Redo logic
	const redo = useCallback((): T => {
		squashCounter.current = 0
		const newIndex = Math.min(index + 1, history.length - 1)
		setIndex(newIndex)
		isUndoRedoClicked.current = true
		return history[newIndex]
	}, [history, index])

	const reset = useCallback((): T => {
		squashCounter.current = 0

		setIndex(startIndex)
		isUndoRedoClicked.current = true
		return history[startIndex]
	}, [history, startIndex])

	const canUndo = useMemo(() => index > startIndex, [index, startIndex])
	const canRedo = useMemo(
		() => index < history.length - 1,
		[index, history.length]
	)

	return {
		state: current,
		undo,
		redo,
		canUndo,
		canRedo,
		index,
		reset,
		initialData,
	}
}

import { useCallback, useEffect, useRef } from 'react'

export const useDebounce = (
	callback: (value: string) => void,
	delay: number
) => {
	const timerRef = useRef<NodeJS.Timeout | null>(null)

	const debouncedCallback = useCallback(
		(value: string) => {
			if (timerRef.current) {
				clearTimeout(timerRef.current)
			}
			timerRef.current = setTimeout(() => {
				callback(value)
			}, delay)
		},
		[callback, delay]
	)

	useEffect(() => {
		return () => {
			if (timerRef.current) {
				clearTimeout(timerRef.current)
			}
		}
	}, [])

	return debouncedCallback
}

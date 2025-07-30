import * as React from 'react'

export const useThrottle = <T>(value: T, delay = 500) => {
	const [throttledValue, setThrottledValue] = React.useState(value)
	const lastExecuted = React.useRef(Date.now())

	React.useEffect(() => {
		const now = Date.now()
		const timeSinceLast = now - lastExecuted.current

		if (timeSinceLast >= delay) {
			setThrottledValue(value)
			lastExecuted.current = now
		} else {
			const timeout = setTimeout(() => {
				setThrottledValue(value)
				lastExecuted.current = Date.now()
			}, delay - timeSinceLast)

			return () => clearTimeout(timeout)
		}
	}, [value, delay])

	return throttledValue
}

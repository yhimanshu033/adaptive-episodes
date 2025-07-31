import * as React from 'react'

export const useThrottledEffect = (
	effect: () => void | (() => void),
	deps: React.DependencyList,
	delay = 500
) => {
	const lastRan = React.useRef(0)
	const timeout = React.useRef<NodeJS.Timeout | null>(null)

	React.useEffect(() => {
		const handler = () => {
			lastRan.current = Date.now()
			if (timeout.current) {
				clearTimeout(timeout.current)
				timeout.current = null
			}
			effect()
		}

		const now = Date.now()
		const timeSinceLast = now - lastRan.current

		if (timeSinceLast >= delay) {
			handler()
		} else {
			if (timeout.current) {
				clearTimeout(timeout.current)
			}
			timeout.current = setTimeout(handler, delay - timeSinceLast)
		}

		return () => {
			if (timeout.current) {
				clearTimeout(timeout.current)
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, deps)
}

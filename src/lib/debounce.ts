type AnyFunction = (...args: unknown[]) => unknown

export function debounce<F extends AnyFunction>(
	func: F,
	delay: number = 500
): (...args: Parameters<F>) => void {
	let timeoutId: ReturnType<typeof setTimeout>

	return function (this: ThisParameterType<F>, ...args: Parameters<F>) {
		clearTimeout(timeoutId)
		timeoutId = setTimeout(() => {
			func.apply(this, args)
		}, delay)
	}
}

export default debounce

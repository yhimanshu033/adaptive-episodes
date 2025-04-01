export const formatDate = (input: string | number, showTime?: boolean) => {
	let dateObj: Date

	if (typeof input === 'string' || typeof input === 'number') {
		dateObj = new Date(
			typeof input === 'number' && input < 10000000000 ? input * 1000 : input
		)
	} else {
		throw new Error('Invalid input type. Expected a string or a number.')
	}

	const options: Intl.DateTimeFormatOptions = {
		day: 'numeric',
		month: 'short',
		year: 'numeric',
	}

	if (showTime) {
		options.hour = 'numeric'
		options.minute = 'numeric'
		options.hour12 = true
	}

	return dateObj.toLocaleString(undefined, options)
}

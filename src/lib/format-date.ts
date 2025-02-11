export const formatDate = (input: string | number) => {
	let dateObj: Date

	if (typeof input === 'string' || typeof input === 'number') {
		dateObj = new Date(
			typeof input === 'number' && input < 10000000000 ? input * 1000 : input
		)
	} else {
		throw new Error('Invalid input type. Expected a string or a number.')
	}

	return dateObj.toLocaleString(undefined, {
		day: 'numeric',
		month: 'short',
		year: 'numeric',
		hour: 'numeric',
		minute: 'numeric',
		hour12: true,
	})
}

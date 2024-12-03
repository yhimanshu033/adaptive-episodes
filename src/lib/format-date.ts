export const formatDate = (input: string | number) => {
	let dateObj: Date

	if (typeof input === 'string') {
		dateObj = new Date(input)
	} else if (typeof input === 'number') {
		if (input < 10000000000) {
			dateObj = new Date(input * 1000)
		} else {
			dateObj = new Date(input)
		}
	} else {
		throw new Error('Invalid input type. Expected a string or a number.')
	}

	return dateObj.toLocaleString('en-US', {
		timeZone: 'Asia/Kolkata',
		day: 'numeric',
		month: 'short',
		year: 'numeric',
		hour: 'numeric',
		minute: 'numeric',
		hour12: true,
	})
}

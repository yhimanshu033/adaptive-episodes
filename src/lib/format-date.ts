export const formatDate = (input: string | number) => {
	let dateObj: Date

	if (typeof input === 'string') {
		// If input is a date string, convert it directly to a Date object
		dateObj = new Date(input)
	} else if (typeof input === 'number') {
		// If input is a number, check if it's in seconds or milliseconds
		if (input < 10000000000) {
			// Assuming input is in seconds (and not a future date), convert to milliseconds
			dateObj = new Date(input * 1000)
		} else {
			// Input is likely in milliseconds
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

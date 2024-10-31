export const formatDate = (date: string) => {
	const dateObj = new Date(date)
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

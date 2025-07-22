'use client'

export function downloadFile(url: string, filename: string) {
	fetch(url)
		.then((response) => {
			if (!response.ok) {
				throw new Error('Network response was not ok')
			}
			return response.blob()
		})
		.then((blob) => {
			const link = document.createElement('a')
			const objectURL = URL.createObjectURL(blob)
			link.href = objectURL
			link.download = filename
			document.body.appendChild(link)
			link.click()
			document.body.removeChild(link)
			URL.revokeObjectURL(objectURL)
		})
		.catch((error) => {
			console.error('There was a problem with the download operation:', error)
		})
}

export function downloadBlobUrl(objectURL: string, filename: string) {
	const link = document.createElement('a')
	link.href = objectURL
	link.download = filename
	document.body.appendChild(link)
	link.click()
	document.body.removeChild(link)
}

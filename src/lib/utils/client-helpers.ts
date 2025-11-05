'use client'

import { CONFIGURATION_DATA_KEY } from '@/constants/global-constants'

import { TConfigurationData } from '@/types/editor-types'

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

export async function downloadFileAsync(
	url: string,
	filename: string
): Promise<void> {
	try {
		const response = await fetch(url)
		if (!response.ok) {
			throw new Error(`Failed to download ${filename}: ${response.statusText}`)
		}

		const blob = await response.blob()
		const link = document.createElement('a')
		const objectURL = URL.createObjectURL(blob)

		link.href = objectURL
		link.download = filename
		document.body.appendChild(link)
		link.click()
		document.body.removeChild(link)
		URL.revokeObjectURL(objectURL)
	} catch (error) {
		console.error(`Error downloading ${filename}:`, error)
		throw error
	}
}

export function downloadBlobUrl(objectURL: string, filename: string) {
	const link = document.createElement('a')
	link.href = objectURL
	link.download = filename
	document.body.appendChild(link)
	link.click()
	document.body.removeChild(link)
}

export function removeVoicePass2XMLTags() {
	// Step 1: Find all section-start elements and collect their IDs
	const sectionStartElements = document.querySelectorAll('section-start')
	const hiddenSectionIds = new Set()

	sectionStartElements.forEach((el) => {
		const id = el.getAttribute('id')
		if (id) {
			hiddenSectionIds.add(id)
		}
	})

	// Step 2: Find all status elements and hide the ones with matching section attribute
	const statusElements = document.querySelectorAll('status')
	statusElements.forEach((el) => {
		el.insertAdjacentHTML('beforebegin', '<br/> <br/>')
		const section = el.getAttribute('section')
		if (hiddenSectionIds.has(section)) {
			;(el as HTMLDivElement).style.display = 'none'
		}
	})
}

export function adjustScrollIfAtTop(
	container: HTMLDivElement | null,
	padding = 30,
	offset = 50
) {
	if (!container) {
		return
	}
	const scrollTop = container.scrollTop

	const isAtTop = scrollTop <= padding

	if (isAtTop) {
		requestAnimationFrame(() => {
			container.scrollBy({
				top: scrollTop + offset,
				behavior: 'smooth',
			})
		})
	}
}

export function scrollToDivWithId(
	id: string,
	timeout = 0,
	opts?: ScrollIntoViewOptions
) {
	setTimeout(() => {
		const elem = document.getElementById(id)
		if (!elem) {
			return
		}
		requestAnimationFrame(() => {
			elem.scrollIntoView({ behavior: 'smooth', block: 'center', ...opts })
		})
	}, timeout)
}

export function getLocallyStoredConfiguration() {
	if (typeof window === 'undefined') {
		// SSR Guard
		return null
	}
	const storedDataStr = localStorage.getItem(CONFIGURATION_DATA_KEY)
	if (!storedDataStr) {
		return null
	}
	try {
		const parsedStoredData = JSON.parse(storedDataStr) as TConfigurationData
		return parsedStoredData
	} catch {
		return null
	}
}

export function setLocallyStoredConfiguration(
	data: Partial<TConfigurationData>
) {
	const storedDataStr = (getLocallyStoredConfiguration() ||
		{}) as Partial<TConfigurationData>
	const newDataStr = JSON.stringify({
		...storedDataStr,
		...data,
	})
	localStorage.setItem(CONFIGURATION_DATA_KEY, newDataStr)
}

export function scaleFontSizes(id: string) {
	// Select all descendants of the div
	const rootDiv = document.getElementById(id)
	if (!rootDiv) {
		return
	}
	const elements = rootDiv.querySelectorAll('*')

	elements.forEach((el) => {
		const style = el.getAttribute('style')
		if (!style) {
			return
		}

		// Match font-size declarations (handles units like px, em, rem, etc.)
		const fontSizeRegex = /font-size\s*:\s*([^;]+)/i
		const match = style.match(fontSizeRegex)

		if (match) {
			const currentValue = match[1].trim()

			// Avoid double-wrapping if already has calc()
			if (!currentValue.startsWith('calc(')) {
				const newFontSize = `calc(${currentValue} * var(--editor-scale,1))`

				// Replace the font-size value in the style string
				const newStyle = style.replace(
					fontSizeRegex,
					`font-size: ${newFontSize}`
				)

				// Apply the updated style
				el.setAttribute('style', newStyle)
			}
		}
	})
}

'use client'

import { DiffStatus } from '@/constants/ai-constants'
import { Node, Path } from 'platejs'
import { PlateEditor } from 'platejs/react'

import { DiffPlugin } from '@/components/editor/plugins/diff-kit'

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

export const findAllDiffNodes = <E extends PlateEditor>(
	editor: E
): Array<{ node: Node; path: Path }> =>
	Array.from(
		editor.api.nodes({
			match: (n: Node) => {
				return DiffPlugin.key in n && n.status === DiffStatus.PENDING
			},
			at: [],
		}),
		([node, path]) => ({ node, path })
	)

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

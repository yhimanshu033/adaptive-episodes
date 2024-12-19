import { TComment } from '@udecode/plate-comments'
import {
	nanoid,
	TDescendant,
	TElement,
	TText,
	Value,
} from '@udecode/plate-common'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

import { BASE_STATUS, EStatus, MinifiedValue } from '@/types/common'
import { TGetMetadataResponse } from '@/types/content-types'
import { IndexedCommentsResponse, ReviewComment } from '@/types/editor-types'
import { TEpisode, TGetEpisodesResponse } from '@/types/episode-type'

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export function getQueryParam(
	url: string | null | undefined,
	paramName: string
): string | undefined {
	try {
		if (!url) return undefined
		const urlObj = new URL(url)
		return urlObj.searchParams.get(paramName) ?? undefined
	} catch (error) {
		console.error('Invalid URL', error)
		return undefined
	}
}

export const getSelectedEpisode = (
	data: TGetEpisodesResponse,
	selectedStatus?: EStatus
): { episode: TEpisode; latestStatus: EStatus | typeof BASE_STATUS } => {
	const prioritizedStatuses = [
		EStatus.PUBLISHED,
		EStatus.POLISH,
		EStatus.SECOND_DRAFT,
		EStatus.FIRST_DRAFT,
	]

	let selectedEpisode: TEpisode | undefined

	if (selectedStatus) {
		selectedEpisode = data.results.data.find(
			(episode) => episode.status === selectedStatus
		)
	}

	if (!selectedEpisode) {
		for (const status of prioritizedStatuses) {
			selectedEpisode = data.results.data.find(
				(episode) => episode.status === status
			)
			if (selectedEpisode) break
		}
	}

	const latestStatus =
		prioritizedStatuses.find((status) =>
			data.results.data.some((episode) => episode.status === status)
		) ?? data.results.data[0].status

	return { episode: selectedEpisode ?? data.results.data[0], latestStatus }
}

export const minify = (children: Value): MinifiedValue => {
	const traverse = (nodes: TDescendant[], path: number[]): MinifiedValue => {
		return nodes.flatMap((node, index) => {
			const currentPath = [...path, index]
			if ('text' in node) {
				return [{ id: currentPath.join('_'), text: String(node.text) }]
			} else if ('children' in node) {
				return traverse(node.children, currentPath)
			}
			return []
		})
	}

	return traverse(children, [])
}

export const maxify = (minified: MinifiedValue, children: Value): Value => {
	const applyText = (nodes: TDescendant[], path: number[]): TDescendant[] => {
		return nodes.map((node, index) => {
			const currentPath = [...path, index]

			if ('text' in node) {
				const matchingValue = minified.find(
					(item) => item.id === currentPath.join('_')
				)
				if (matchingValue) {
					return {
						...node,
						text: matchingValue.text,
					}
				}
				return node
			} else if ('children' in node) {
				return {
					...node,
					children: applyText(node.children, currentPath),
				}
			}
			return node
		})
	}

	return children.map((child, index) => ({
		...child,
		children: applyText(child.children, [index]),
	}))
}

export const replaceMatches = (
	regex: RegExp,
	matches: RegExpMatchArray,
	children: Value
): Value => {
	const modify = (nodes: TDescendant[]): TDescendant[] => {
		return nodes.map((node) => {
			if ('text' in node) {
				const text = (node.text as string).replace(
					regex,
					(match) => matches.shift() || match
				)
				return {
					...node,
					text,
				}
			} else if ('children' in node) {
				return {
					...node,
					children: modify(children),
				}
			}
			return node
		})
	}
	const result = children.map((child) => ({
		...child,
		children: modify(child.children),
	}))
	console.log(result)
	return result
}

export function replaceNthInsensitive(
	str: string,
	search: string,
	replace: string,
	nth: number
): string {
	const regex = new RegExp(search, 'gi')
	let matchCount = 0

	return str.replace(regex, (match) => {
		matchCount++
		return matchCount === nth + 1 ? replace : match
	})
}

export function getText(val: Value) {
	let text = ''
	function getTextFromNode(node: TDescendant) {
		if ('text' in node) {
			text += String(node.text)
		} else {
			node.children.forEach(getTextFromNode)
		}
	}
	val.forEach((node, i) => {
		if (i > 0) text += '\n'
		getTextFromNode(node)
	})
	return text
}

export function prettifyNumber(
	num: number,
	locale: string = 'de-DE', // 'en-US' for English
	options?: Intl.NumberFormatOptions
): string {
	return new Intl.NumberFormat(locale, options).format(num)
}

export function jsonify(value: string): string | Value {
	try {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
		const val = JSON.parse(value)
		return val as Value
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
	} catch (e) {
		return value
	}
}

export function clearLasers(ogVal: Value): Value {
	const val = structuredClone(ogVal)
	const traverse = (node: TDescendant) => {
		const keys = Object.keys(node).filter(
			(key) =>
				key.startsWith('laser') ||
				key.startsWith('floating-prompt') ||
				key.startsWith('prompt-')
		)
		if (keys.length) {
			keys.forEach((key) => {
				delete node[key]
			})
			delete node.laser
		} else if ('children' in node) {
			;(node.children as TDescendant[]).forEach(traverse)
		}
	}
	val.forEach(traverse)
	return val
}

export function mergeElementNodes(ogVal: TElement): TElement {
	const val = structuredClone(ogVal)
	const merged: TDescendant[] = []
	val.children.forEach((node) => {
		const keys = Object.keys(node)
		const prevKeys = merged.length ? Object.keys(merged[merged.length - 1]) : []
		if ('text' in node) {
			if (
				merged.length &&
				'text' in merged[merged.length - 1] &&
				keys.every((key) => prevKeys.includes(key))
			) {
				;(merged[merged.length - 1] as TText).text += String(node.text)
			} else {
				merged.push(node)
			}
		} else {
			merged.push(node)
		}
	})
	return { ...val, children: merged }
}

export function mergeValue(ogVal: Value): Value {
	const val = structuredClone(ogVal)
	const merged: Value = []
	val.forEach((node) => {
		merged.push(mergeElementNodes(node))
	})
	return merged
}

export function getRecord(comments: TComment[]) {
	const records: Record<string, TComment> = comments.reduce(
		(prev, curr) => {
			return { ...prev, [curr.id]: curr }
		},
		{} as Record<string, TComment>
	)
	return records
}

export function convertReviewResponse(
	response: IndexedCommentsResponse[],
	children: Value
) {
	const comments: ReviewComment[] = []

	const responseMap = new Map(response.map((item) => [item.id, item]))

	const applyComment = (
		nodes: TDescendant[],
		path: number[]
	): TDescendant[] => {
		return nodes.flatMap((node, index) => {
			const currentPath = [...path, index]

			if ('text' in node) {
				const nodeId = currentPath.join('_')
				const matchingValue = responseMap.get(nodeId)

				if (matchingValue) {
					const { start, end } = matchingValue.path
					const { text } = node as { text: string }

					const segments: TText[] = []

					if (start > 0) {
						segments.push({ text: text.slice(0, start) })
					}

					const commentSegment = {
						text: text.slice(start, end),
						comment: true,
					} as TText
					const id = nanoid()
					const commentKey = `comment_${id}`
					commentSegment[commentKey] = true
					comments.push({ id, text: matchingValue.comment })
					segments.push(commentSegment)

					if (end < text.length) {
						segments.push({ text: text.slice(end) })
					}

					return segments
				}

				return [node]
			} else if ('children' in node) {
				return [
					{
						...node,
						children: applyComment(node.children, currentPath),
					},
				]
			}

			return [node]
		})
	}

	const value = children.map((child, index) => ({
		...child,
		children: applyComment(child.children, [index]),
	}))

	return { value, comments }
}

export const extractFromMetadata = (
	metadata: TGetMetadataResponse | null,
	start: number
) => {
	const loglines_array: string[] = []
	const beatsheets_array: string[] = []
	let context: string = ''
	let current = start + 1

	if (metadata?.data) {
		const metadataEntries = Object.values(metadata?.data)

		if (start) {
			context = metadataEntries[0].context
		}

		for (const data of Object.values(metadata.data).slice(start ? 1 : 0)) {
			loglines_array.push(`Ep${current} ${data.loglines}`)
			beatsheets_array.push(`Ep${current} ${data.beatsheet}`)
			current++
		}
	}
	return { loglines_array, beatsheets_array, context }
}

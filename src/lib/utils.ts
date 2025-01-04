/* eslint-disable @typescript-eslint/restrict-plus-operands */
import { TComment } from '@udecode/plate-comments'
import {
	nanoid,
	TDescendant,
	TElement,
	TText,
	Value,
} from '@udecode/plate-common'
import { parse } from 'best-effort-json-parser'
import { clsx, type ClassValue } from 'clsx'
import { jsonrepair } from 'jsonrepair'
import { twMerge } from 'tailwind-merge'

import { BASE_STATUS, EStatus, MinifiedValue } from '@/types/common'
import { TGetMetadataResponse } from '@/types/content-types'
import {
	IndexedCommentsResponse,
	IndexedSFXResponse,
	ReviewComment,
} from '@/types/editor-types'
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
		const newState: TDescendant[] = []

		if (matches[0].startsWith('[!')) {
			newState.push({
				text: matches[0].toUpperCase().replaceAll('!', ''),
				bold: true,
			})
			matches.shift()
		}

		nodes.map((node) => {
			if ('text' in node) {
				const fragments = (node.text as string).split(regex)

				let wasSFX = false

				for (const [index, fragment] of fragments.entries()) {
					if (regex.test(fragment)) {
						if (matches.length && matches[0].includes('[!')) {
							newState.push({
								...node,
								text: matches[0].toUpperCase().replaceAll('!', ''),
								bold: true,
							})
							wasSFX = true
						} else if (newState.length) {
							newState[newState.length - 1].text += fragment
						} else {
							newState.push({
								...node,
								text: fragment,
							})
							wasSFX = false
						}
						matches.shift()
					} else {
						if (wasSFX || !index || !newState.length) {
							newState.push({
								...node,
								text: fragment,
							})
							wasSFX = false
						} else {
							newState[newState.length - 1].text += fragment
						}
					}
				}
			} else if ('children' in node) {
				newState.push({
					...node,
					children: modify(children),
				})
			}
		})

		return newState
	}
	const result = children.map((child) => ({
		...child,
		children: modify(child.children),
	}))
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

export function clearComments(ogVal: Value): Value {
	const val = structuredClone(ogVal)
	const traverse = (node: TDescendant) => {
		let hasComments = false
		for (const key in node) {
			if (key.startsWith('comment')) {
				delete node[key]
				hasComments = true
			}
		}

		if (hasComments) {
			delete node.laser
		} else if ('children' in node) {
			void (node.children as TDescendant[]).forEach(traverse)
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

export function getRecord(comments?: TComment[]) {
	if (!comments) return undefined
	const records: Record<string, TComment> = comments.reduce(
		(prev, curr) => {
			return { ...prev, [curr.id]: curr }
		},
		{} as Record<string, TComment>
	)
	return records
}

export function convertReviewResponse(
	response: Partial<IndexedCommentsResponse>[],
	children: Value
) {
	const comments: ReviewComment[] = []

	const applyComment = (
		nodes: TDescendant[],
		path: number[]
	): TDescendant[] => {
		return nodes.flatMap((node, index) => {
			const currentPath = [...path, index]

			const keys = Object.keys(node)

			if (keys.find((key) => key.includes('comment_'))) {
				return [node]
			}

			if ('text' in node) {
				const nodeId = currentPath.join('_')
				const { text, ...rest } = node as TText
				const segments: TText[] = []
				let lastIndex = 0
				const sortedMatchingValues = response
					.filter((item) => item.id === nodeId && !!item.path)
					.sort((a, b) => {
						if (!a.path || !b.path) return 0
						if (a.path.start !== b.path.start) {
							return a.path.start - b.path.start
						}
						return a.path.end - b.path.end
					})
				const idPathMap = new Set<string>()
				const matchingValues: Partial<IndexedCommentsResponse>[] = []
				let lastAcceptedEnd = -Infinity

				for (const comment of sortedMatchingValues) {
					if (!comment.path) continue
					if (comment.path.start >= lastAcceptedEnd) {
						matchingValues.push(comment)
						lastAcceptedEnd = comment.path.end
					}
				}

				for (const matchingValue of matchingValues) {
					if (
						!matchingValue.path ||
						matchingValue.path.end === -1 ||
						matchingValue.path.start === -1
					)
						continue
					const { start, end } = matchingValue.path
					if (idPathMap.has(`${matchingValue.id}-${start}-${end}`)) continue
					idPathMap.add(`${matchingValue.id}-${start}-${end}`)

					if (lastIndex < start) {
						segments.push({ ...rest, text: text.slice(lastIndex, start) })
					}

					const commentSegment = {
						...rest,
						text: text.slice(start, end),
						comment: true,
					} as TText

					const id = nanoid()
					const commentKey = `comment_${id}`
					commentSegment[commentKey] = true
					comments.push({ id, text: matchingValue.comment || '' })

					segments.push(commentSegment)

					lastIndex = end
				}

				if (lastIndex < text.length) {
					segments.push({ ...rest, text: text.slice(lastIndex) })
				}
				return segments.length ? segments : [node]
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

	if (metadata?.data) {
		const metadataEntries = Object.values(metadata?.data)

		if (start) {
			context = metadataEntries[0].context
		}

		for (const data of Object.values(metadata.data).slice(start ? 1 : 0)) {
			loglines_array.push(`Ep ${data.loglines}`)
			beatsheets_array.push(`Ep ${data.beatsheet}`)
		}
	}
	return { loglines_array, beatsheets_array, context }
}

export const getRandomElement = <T>(arr: T[]): T => {
	return arr[Math.floor(Math.random() * arr.length)]
}

export function extractBetweenTags(input: string, tagName: string): string {
	const openingTag = `<${tagName}>`
	const closingTag = `</${tagName}>`

	let result = ''
	let startIndex = input.indexOf(openingTag)

	while (startIndex !== -1) {
		const endIndex = input.indexOf(closingTag, startIndex)
		if (endIndex === -1) {
			break
		}

		const content = input
			.substring(startIndex + openingTag.length, endIndex)
			.trim()
		if (content) {
			result += (result ? '\n' : '') + content
		}

		startIndex = input.indexOf(openingTag, endIndex + closingTag.length)
	}

	return result
}

export const extractScenesFromBeatsheet = (beatsheet: string) => {
	const sceneStart = beatsheet.match(
		/Szenen\s*\(Version 2\)\s*:|Szenen\s+Breakdown\s*:/
	)

	if (!sceneStart) {
		return []
	}

	const sceneSection = beatsheet
		.slice(beatsheet.indexOf(sceneStart[0]) + sceneStart[0].length)
		.trim()

	const nextSectionIndex = sceneSection.search(/(?:Plot\s+Progressions)/)

	const trimmedSceneSection =
		(nextSectionIndex !== -1
			? sceneSection.slice(0, nextSectionIndex).trim()
			: sceneSection) + '\n['

	const sceneRegex =
		/(?:(?:^(INT|EXT|SCENE)\s-\s([^\n]+)[\n\s]+([\s\S]*?))|(?:^\[([^\]]+)\]\s*([\s\S]*?)))(?=^(?:INT|EXT|SCENE|SCENE|\[))/gm
	const scenes: { content: string; title: string }[] = []
	let match

	while ((match = sceneRegex.exec(trimmedSceneSection)) !== null) {
		const title = match[4]?.trim() || `${match[1]} - ${match[2]}`?.trim() || ''
		const content = match[5]?.trim() || match[3]?.trim() || ''

		scenes.push({ title, content })
	}

	return scenes
}

export function mergeStrings(s1: string, s2: string): string {
	const s1Lines = s1.split('\n')
	const s2Lines = s2.split('\n')

	let mergeIndex = s1Lines.length - 1
	while (mergeIndex >= 0 && !s1Lines[mergeIndex].trim()) {
		mergeIndex--
	}

	const merged = [
		...s1Lines.slice(0, mergeIndex + 1),
		...s2Lines.slice(mergeIndex + 1),
	]

	return merged.join('\n')
}

export function sanitizeJsonString(badJson: string) {
	return (
		badJson
			// Escape backslashes
			.replace(/\\/g, '\\\\')
			// Escape double quotes
			.replace(/(?<!\\)"/g, '\\"')
			// Handle newlines
			.replace(/\n/g, '\\n')
			// Handle tabs
			.replace(/\t/g, '\\t')
	)
}

export function addSFX(
	sfx: IndexedSFXResponse,
	children: Value,
	key: string
): Value {
	const applyText = (nodes: TDescendant[], path: number[]): TDescendant[] => {
		return nodes.flatMap((node, index) => {
			const currentPath = [...path, index]

			if ('text' in node) {
				const matchingValues = sfx.filter(
					(item) => item.id === currentPath.join('_')
				)

				if (matchingValues.length === 0) {
					return [node]
				}

				const segments: TDescendant[] = []
				let currentIndex = 0
				const text = node.text as string

				matchingValues.forEach((matchingValue) => {
					const matchIndex = text.indexOf(
						matchingValue.match_string,
						currentIndex
					)

					if (matchIndex > currentIndex) {
						segments.push({
							...node,
							text: text.slice(currentIndex, matchIndex),
						})
					}

					segments.push({
						type: key,
						text: `\n${matchingValue.sfx}\n`,
						bold: true,
					})

					currentIndex = matchIndex
				})

				if (currentIndex < text.length) {
					segments.push({ ...node, text: text.slice(currentIndex) })
				}

				return segments
			} else if ('children' in node) {
				return [
					{
						...node,
						children: applyText(node.children, currentPath),
					},
				]
			}

			return [node]
		})
	}

	return children.map((child, index) => ({
		...child,
		children: applyText(child.children, [index]),
	}))
}

export function parsSFX<T>(input: string) {
	try {
		return parse(input) as T
	} catch (e) {
		console.log(e)
		try {
			const repaired = jsonrepair(input)
			return parse(repaired) as T
		} catch (e) {
			console.log(e)
			return null
		}
	}
}

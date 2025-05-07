import {
	nanoid,
	TDescendant,
	TElement,
	TText,
	Value,
} from '@udecode/plate-common'

import { generateGenitives } from '@/lib/utils/helpers'

import {
	EChatMode,
	StoryExplorerConfiguration,
	TLocalizeArrayItem,
	TLocalizeCharacterArrayItem,
	TLocalizeConceptArrayItem,
	TLocalizeObjectArrayItem,
	TLocalizePlaceArrayItem,
	TLocalizeResponse,
} from '@/types/ai-types'
import { MinifiedValue } from '@/types/common'
import { TGetMetadataResponse } from '@/types/content-types'
import {
	IndexedCommentsResponse,
	IndexedSFXResponse,
	IndexedVoicePassResponse,
	ReviewComment,
	TLocalizationObject,
} from '@/types/editor-types'

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
						if (!a.path || !b.path) {
							return 0
						}
						if (a.path.start !== b.path.start) {
							return a.path.start - b.path.start
						}
						return a.path.end - b.path.end
					})
				const idPathMap = new Set<string>()
				const matchingValues: Partial<IndexedCommentsResponse>[] = []
				let lastAcceptedEnd = -Infinity

				for (const comment of sortedMatchingValues) {
					if (!comment.path) {
						continue
					}
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
					) {
						continue
					}
					const { start, end } = matchingValue.path
					if (idPathMap.has(`${matchingValue.id}-${start}-${end}`)) {
						continue
					}
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
	metadata: TGetMetadataResponse | null | undefined
) => {
	const loglines_array: string[] = []
	const beatsheets_array: string[] = []
	let context: string = ''

	if (metadata?.data) {
		const metadataEntries = Object.values(metadata?.data)

		context = metadataEntries[0]?.context ?? ''

		for (const data of Object.values(metadata.data)) {
			loglines_array.push(`Ep ${data.loglines}`)
			beatsheets_array.push(`Ep ${data.beatsheet}`)
		}
	}
	return { loglines_array, beatsheets_array, context }
}

export const extractScenesFromBeatsheet = (beatsheet: string) => {
	const sceneStart = beatsheet?.match(
		/Szenen\s*\(Version 2\)\s*:|Szenen\s+Breakdown\s*:|Scene\s+Breakdown\s*:|Scene\s*\(Version 2\)\s*:/
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
		/(?:(?:^(INT|EXT|INT\/EXT|SCENE)\s*-\s*([^\n]+)[\n\s]+([\s\S]*?))|(?:\[([^\]]+)\]\s*([\s\S]*?)))(?=^(?:INT|EXT|SCENE|SCENE)|\s*\[)/gm
	const scenes: { content: string; title: string }[] = []
	let match

	while ((match = sceneRegex.exec(trimmedSceneSection)) !== null) {
		const title = match[4]?.trim() || `${match[1]} - ${match[2]}`?.trim() || ''
		const content = match[5]?.trim() || match[3]?.trim() || ''

		scenes.push({ title, content })
	}
	return scenes
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
					if (!text.includes(matchingValue.match_string)) {
						return
					}
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
					if (matchingValue.sfx) {
						segments.push({
							type: key,
							text: `\n${matchingValue.sfx.replace(/\[!/g, '[').replace(/\]\s*\[/g, ']\n[')}\n`,
							bold: true,
						})
					}

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

export function addVoicePass(
	voicePass: IndexedVoicePassResponse,
	children: Value
): Value {
	const applyText = (nodes: TDescendant[], path: number[]): TDescendant[] => {
		return nodes.flatMap((node, index) => {
			const currentPath = [...path, index]

			if ('text' in node) {
				const matchingValues = voicePass.filter(
					(item) => item.id === currentPath.join('_')
				)

				if (matchingValues.length === 0) {
					return [node]
				}

				const segments: TDescendant[] = []
				const text = node.text as string

				matchingValues.forEach((matchingValue) => {
					if (!text.includes(matchingValue.match_string)) {
						return
					}
					if (matchingValue.rewrite) {
						segments.push({
							...node,
							text: text.replace(
								matchingValue.match_string,
								matchingValue.rewrite
							),
						})
					}
				})
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

export function getStoryExplorerConfigArray(
	config: StoryExplorerConfiguration
): string[] {
	const configArray = Object.keys(config)
		.map((key) => config[key as keyof typeof config] && key)
		.filter(Boolean) as string[]

	return configArray
}

export function isEditingAction(action: EChatMode) {
	return action === EChatMode.SFX || action === EChatMode.REVIEW
}

export function replaceOnce({
	children,
	path,
	replace,
	search,
}: {
	children: Value
	path: number[]
	replace: string
	search: string
}) {
	const updatedChildren = structuredClone(children)
	const node = updatedChildren[path[0]].children[path[1]] as TElement
	const text = replaceNthInsensitive(
		node.text as string,
		search,
		replace,
		path[2]
	)
	updatedChildren[path[0]].children[path[1]] = {
		...node,
		text,
	}
	return updatedChildren
}

export function replaceAll({
	children,
	replace,
	replaceEnabled,
	search,
	caseSensitive,
	genitive,
	wholeWord,
}: {
	caseSensitive: boolean | undefined
	children: Value
	genitive: boolean | undefined
	replace: string
	replaceEnabled: boolean | undefined
	search: string
	wholeWord: boolean | undefined
}) {
	const updatedChildren = structuredClone(children)
	function processNode(node: TElement | TText): void {
		if ('text' in node) {
			if (!replaceEnabled || !search) {
				return
			}
			const regex = new RegExp(
				wholeWord
					? `(\\b${genitive ? generateGenitives(search) + "'?|" : ''}${search})(?=\\b|\\W|$)`
					: `(${search})`,
				caseSensitive ? 'g' : 'gi'
			)
			node.text = String(node.text).replace(regex, (match) =>
				match !== search ? generateGenitives(replace) : replace
			)
		} else if ('children' in node) {
			node.children.forEach(processNode)
		}
	}
	updatedChildren.forEach(processNode)

	return updatedChildren
}

export function getRecordsUtil({
	children,
	search,
	caseSensitive,
	genitive,
	wholeWord,
}: {
	caseSensitive: boolean | undefined
	children: Value
	genitive: boolean | undefined
	search: string
	wholeWord: boolean | undefined
}) {
	const records: number[][] = []
	children.forEach((node, index) => {
		const getCount = (node: TElement | TText, path: number[]): void => {
			if ('text' in node) {
				const regex = new RegExp(
					wholeWord
						? `(\\b${genitive ? generateGenitives(search) + "'?|" : ''}${search})(?=\\b|\\W|$)`
						: `(${search})`,
					caseSensitive ? 'g' : 'gi'
				)
				const matches = String(node.text).match(regex)
				matches?.forEach((m, i) => records.push([...path, i]))
			} else if ('children' in node) {
				node.children.forEach((child, childIndex) =>
					getCount(child, [...path, childIndex])
				)
			}
		}
		getCount(node, [index])
	})
	return records
}

export function getOccurrencesUtil({
	children,
	search,
	caseSensitive,
	genitive,
	wholeWord,
}: {
	caseSensitive: boolean | undefined
	children: Value
	genitive: boolean | undefined
	search: string
	wholeWord: boolean | undefined
}) {
	return children.reduce((acc, node) => {
		const getCount = (node: TElement | TText): number => {
			if ('text' in node) {
				const regex = new RegExp(
					wholeWord
						? `(\\b${genitive ? generateGenitives(search) + "'?|" : ''}${search})(?=\\b|\\W|$)`
						: `(${search})`,
					caseSensitive ? 'g' : 'gi'
				)
				const matches = String(node.text).match(regex)
				return matches ? matches.length : 0
			} else if ('children' in node) {
				return node.children.reduce(
					(childAcc, child) => childAcc + getCount(child),
					0
				)
			}
			return 0
		}
		return acc + getCount(node)
	}, 0)
}

export function getLocalizationData({
	data,
}: {
	data: TLocalizeResponse['result'] | undefined
}) {
	const characters = Object.keys(data?.characters || {}).reduce((acc, key) => {
		const obj = data?.characters?.[key]
		if (obj) {
			acc.push({ ...obj, name: key })
		}
		return acc
	}, [] as Array<TLocalizeCharacterArrayItem>)

	const places = Object.keys(data?.places || {}).reduce((acc, key) => {
		const obj = data?.places?.[key]
		if (obj) {
			acc.push({ ...obj, name: key })
		}
		return acc
	}, [] as Array<TLocalizePlaceArrayItem>)

	const concepts = Object.keys(data?.concepts || {}).reduce((acc, key) => {
		const obj = data?.concepts?.[key]
		if (obj) {
			acc.push({ ...obj, name: key })
		}
		return acc
	}, [] as Array<TLocalizeConceptArrayItem>)

	const objects = Object.keys(data?.objects || {}).reduce((acc, key) => {
		const obj = data?.objects?.[key]
		if (obj) {
			acc.push({ ...obj, name: key })
		}
		return acc
	}, [] as Array<TLocalizeObjectArrayItem>)

	const localized_entities: TLocalizationObject = [
		{
			title: 'Characters',
			entities: characters,
		},
		{
			title: 'Places',
			entities: places,
		},
		{
			title: 'Concepts',
			entities: concepts,
		},
		{
			title: 'Objects',
			entities: objects,
		},
	] as const

	return localized_entities
}

export function getSuggestionValue(suggestion: TLocalizeArrayItem) {
	return 'localized_name' in suggestion
		? suggestion.localized_name
		: 'localized_concept' in suggestion
			? suggestion.localized_concept
			: 'localized_object' in suggestion
				? suggestion.localized_object
				: suggestion.localized_place
}

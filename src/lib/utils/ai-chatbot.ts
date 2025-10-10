import { FAR_PADDING_TEXT } from '@/constants/editor-constants'
import { Descendant, Element, nanoid, TCommentText, Text, Value } from 'platejs'

import {
	extractWords,
	generateGenitives,
	parseOptimistically,
} from '@/lib/utils/helpers'
import { getText } from '@/lib/utils/plate'

import {
	EChatMode,
	StoryExplorerConfiguration,
	TGetRegexFAR,
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
	const traverse = (nodes: Descendant[], path: number[]): MinifiedValue => {
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
	const applyText = (nodes: Descendant[], path: number[]): Descendant[] => {
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

	const applyComment = (nodes: Descendant[], path: number[]): Descendant[] => {
		return nodes.flatMap((node, index) => {
			const currentPath = [...path, index]

			const keys = Object.keys(node)

			if (keys.find((key) => key.includes('comment_'))) {
				return [node]
			}

			if ('text' in node) {
				const nodeId = currentPath.join('_')
				const { text, ...rest } = node as Text
				const segments: Text[] = []
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

					const id = nanoid()
					const key = `comment_${id}`
					const textFragment = text.slice(start, end)

					const commentSegment = {
						...rest,
						text: textFragment,
						comment: true,
						[key]: true,
					} as TCommentText

					segments.push(commentSegment)
					comments.push({
						id,
						text: matchingValue.comment || '',
						nodeText: textFragment,
						nodeId,
					})

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

export function addSFX(sfx: IndexedSFXResponse, children: Value, key: string) {
	let sfxCount = 0
	const applyText = (nodes: Descendant[], path: number[]): Descendant[] => {
		return nodes.flatMap((node, index) => {
			const currentPath = [...path, index]

			if ('text' in node) {
				const matchingValues = sfx.filter(
					(item) => item.id === currentPath.join('_')
				)

				if (matchingValues.length === 0) {
					return [node]
				}

				const segments: Descendant[] = []
				let currentIndex = 0
				const text = node.text as string

				matchingValues.forEach((matchingValue) => {
					const alphanumericText = text.replace(/[^\w\s]/g, '@')
					const alphanumericMatchString = matchingValue.match_string?.replace(
						/[^\w\s]/g,
						'@'
					)

					if (
						!alphanumericMatchString ||
						!alphanumericText.includes(alphanumericMatchString)
					) {
						return
					}
					const matchIndex = alphanumericText.indexOf(
						alphanumericMatchString,
						currentIndex
					)

					if (matchIndex > currentIndex) {
						segments.push({
							...node,
							text: text.slice(currentIndex, matchIndex),
						})
					}
					if (matchingValue.sfx) {
						sfxCount++
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

	const newChildren = children.map((child, index) => ({
		...child,
		children: applyText(child.children, [index]),
	}))

	return { sfxCount, newChildren }
}

export function addVoicePass(
	voicePass: IndexedVoicePassResponse,
	children: Value
): Value {
	const applyText = (nodes: Descendant[], path: number[]): Descendant[] => {
		return nodes.flatMap((node, index) => {
			const currentPath = [...path, index]

			if ('text' in node) {
				const matchingValues = voicePass.filter(
					(item) => item.id === currentPath.join('_')
				)

				if (matchingValues.length === 0) {
					return [node]
				}

				const segments: Descendant[] = []
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
	if (!path) {
		return children
	}
	const node = updatedChildren?.[path[0]]?.children?.[path[1]] as Element
	if (!node?.text) {
		return children
	}
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
	function processNode(node: Element | Text): void {
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
	children: Value
} & TGetRegexFAR) {
	const records: number[][] = []
	if (!search?.trim?.().length) {
		return records
	}
	children.forEach((node, index) => {
		const getCount = (node: Element | Text, path: number[]): void => {
			if ('text' in node) {
				const regex = getFindReplaceRegex({
					caseSensitive,
					genitive,
					search,
					wholeWord,
				})
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
	console.log({ records, children, search, caseSensitive, genitive, wholeWord })
	return records
}

export function getRecordsTextUtil({
	children,
	records,
	caseSensitive,
	genitive,
	search,
	wholeWord,
}: {
	children: Value
	records: number[][]
} & TGetRegexFAR) {
	const texts: string[][] = []
	records.forEach((record) => {
		if (record.some((num) => num !== 0 && !num)) {
			return
		}
		const block = children[record[0]]

		const leaf = block?.children?.[record[1]] as Text | undefined
		if (!leaf?.text) {
			return
		}

		const regex = getFindReplaceRegex({
			caseSensitive,
			genitive,
			search,
			wholeWord,
		})
		const matches = String(leaf.text).match(regex)
		const match = matches?.[record[2]]

		if (!match) {
			return
		}

		// initialize the text array --> prev, searchedWord, next
		const textArray: string[] = ['', match, '']

		// for previous texts
		let remainingPrevText = FAR_PADDING_TEXT

		// add text from same leaf
		const prevLeafText = leaf.text
			.split(regex)
			.slice(0, record[2] + 1)
			.join('')
		const remainingPrevLeafText = extractWords(
			prevLeafText,
			remainingPrevText,
			true
		)
		textArray[0] = remainingPrevLeafText
		remainingPrevText = FAR_PADDING_TEXT - textArray[0].length

		if (remainingPrevText > 0) {
			// add text from same block
			const prevBlockText = getText([
				{
					children: block.children.slice(0, record[1]),
					type: 'p',
				},
			])
			const remainingPrevBlockText = extractWords(
				prevBlockText,
				remainingPrevText,
				true
			)
			textArray[0] = remainingPrevBlockText + textArray[0]
			remainingPrevText = FAR_PADDING_TEXT - textArray[0].length
		}

		if (remainingPrevText > 0) {
			// add text from previous children
			const prevChildrenText = getText(children.slice(0, record[0]))
			const remainingPrevChildText = extractWords(
				prevChildrenText,
				remainingPrevText,
				true
			)
			textArray[0] = remainingPrevChildText + textArray[0]
		}

		// for next texts
		let remainingNextText = FAR_PADDING_TEXT

		// same leaf
		const nextLeafText = leaf.text
			.split(regex)
			.slice(record[2] + 2)
			.join('')
		const remainingNextLeafText = extractWords(nextLeafText, remainingNextText)
		textArray[2] = remainingNextLeafText
		remainingNextText = FAR_PADDING_TEXT - textArray[2].length

		if (remainingNextText > 0) {
			// add text from same block
			const nextBlockText = getText([
				{
					children: block.children.slice(record[1] + 1),
					type: 'p',
				},
			])
			const remainingNextBlockText = extractWords(
				nextBlockText,
				remainingNextText
			)
			textArray[2] = textArray[2] + remainingNextBlockText
			remainingNextText = FAR_PADDING_TEXT - textArray[2].length
		}

		if (remainingNextText > 0) {
			// add text from previous children
			const nextChildrenText = getText(children.slice(record[0] + 1))
			const remainingNextChildText = extractWords(
				nextChildrenText,
				remainingNextText
			)
			textArray[2] = textArray[2] + remainingNextChildText
		}

		texts.push(textArray)
	})

	return texts
}

export function getFindReplaceRegex({
	search,
	caseSensitive,
	genitive,
	wholeWord,
}: TGetRegexFAR) {
	return new RegExp(
		wholeWord
			? `(\\b${genitive ? generateGenitives(search) + "'?|" : ''}${search})(?=\\b|\\W|$)`
			: `(${search})`,
		caseSensitive ? 'g' : 'gi'
	)
}

export function getOccurrencesUtil({
	children,
	search,
	caseSensitive,
	genitive,
	wholeWord,
}: {
	children: Value
} & TGetRegexFAR) {
	if (!search?.trim?.()?.length) {
		return 0
	}
	return children.reduce((acc, node) => {
		const getCount = (node: Element | Text): number => {
			if ('text' in node) {
				const regex = getFindReplaceRegex({
					search,
					caseSensitive,
					genitive,
					wholeWord,
				})
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

export function parseSFXResponse({
	throttledResponse = [],
}: {
	throttledResponse?: string[]
}) {
	let parsedResponse = parseOptimistically<IndexedSFXResponse>(
		throttledResponse.join('')
	)
	if (!parsedResponse) {
		return []
	}
	parsedResponse = parsedResponse
		.filter((item) => {
			const keys = Object.keys(item)
			return keys.includes('match_string') &&
				keys.includes('sfx') &&
				keys.includes('id')
				? item
				: null
		})
		.filter(Boolean)

	if (!parsedResponse.length) {
		return []
	}

	return parsedResponse
}

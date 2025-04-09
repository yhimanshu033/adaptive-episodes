/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any  */

import { EXCLUDE_BREAKDOWN_KEYS } from '@/constants/editor-constants'
import { TComment } from '@udecode/plate-comments'
import { TDescendant, TElement, TText, Value } from '@udecode/plate-common'
import { computeDiff } from '@udecode/plate-diff'
import { TSuggestionDescription } from '@udecode/plate-suggestion'
import { type BaseRange, type Range } from 'slate'

import { EReviewType, TCustomComment, TReview } from '@/types/editor-types'
import { Selection } from '@/types/plate-types'

export function isSameBlock(selection: Selection): boolean {
	return selection.anchor.path[0] === selection.focus.path[0]
}

export function isSameChild(selection: Selection): boolean {
	return selection.anchor.path[1] === selection.focus.path[1]
}

export function getBlockDistance(selection: Selection): number {
	return Math.abs(selection.anchor.path[0] - selection.focus.path[0])
}

export function getStartAndEnd(selection: Selection) {
	const start = isSameBlock(selection)
		? isSameChild(selection)
			? selection.anchor.offset < selection.focus.offset
				? selection.anchor
				: selection.focus
			: selection.anchor.path[1] < selection.focus.path[1]
				? selection.anchor
				: selection.focus
		: selection.anchor.path[0] < selection.focus.path[0]
			? selection.anchor
			: selection.focus

	const end = isSameBlock(selection)
		? isSameChild(selection)
			? selection.anchor.offset < selection.focus.offset
				? selection.focus
				: selection.anchor
			: selection.anchor.path[1] < selection.focus.path[1]
				? selection.focus
				: selection.anchor
		: selection.anchor.path[0] < selection.focus.path[0]
			? selection.focus
			: selection.anchor

	return { start, end }
}

export function jsonify(value: string): string | Value {
	try {
		const val = JSON.parse(value) as Value
		const nonIdNode = val.find(
			(node) => !node.id || isNaN(parseInt(node.id as string))
		)
		if (nonIdNode) {
			return val
		}
		try {
			val.sort((a, b) => parseInt(a.id as string) - parseInt(b.id as string))
			return val
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
		} catch (error) {
			return val
		}
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

export function getRecord(comments?: TComment[]) {
	if (!comments) return {}
	const records: Record<string, TComment> = comments.reduce(
		(prev, curr) => {
			return { ...prev, [curr.id]: curr }
		},
		{} as Record<string, TComment>
	)
	return records
}

export function clearLaserNode(ogVal: Value, key: string, pluginKey: string) {
	const val = structuredClone(ogVal)
	const traverse = (node: TDescendant) => {
		const keys = Object.keys(node)
		if (keys.includes(key) && keys.includes(pluginKey)) {
			const filteredKeys = keys.filter(
				(item) => item !== key && item !== pluginKey && item !== 'text'
			)
			if (!filteredKeys.length) return
			for (const anyKey of filteredKeys) {
				delete node[anyKey]
			}
		}
		if ('children' in node) {
			void (node.children as TDescendant[]).forEach(traverse)
		}
	}
	val.forEach(traverse)
	return val
}

export function getStartEndFromRange(range: BaseRange) {
	const { anchor, focus } = range
	const isAnchorBeforeFocus =
		anchor.path[0] < focus.path[0] ||
		(anchor.path[0] === focus.path[0] && anchor.path[1] < focus.path[1]) ||
		(anchor.path[0] === focus.path[0] &&
			anchor.path[1] === focus.path[1] &&
			anchor.offset <= focus.offset)

	const start = isAnchorBeforeFocus ? anchor : focus
	const end = isAnchorBeforeFocus ? focus : anchor

	const startParentIndex = start.path[0]
	const startChildIndex = start.path[1]
	const endParentIndex = end.path[0]
	const endChildIndex = end.path[1]

	return {
		start,
		end,
		startParentIndex,
		startChildIndex,
		endParentIndex,
		endChildIndex,
	}
}

export function mergeBlocks(
	ogVal: Value,
	path: Range,
	keys: string[] = []
): Value {
	const {
		start,
		end,
		startParentIndex,
		startChildIndex,
		endParentIndex,
		endChildIndex,
	} = getStartEndFromRange(path)
	const value = structuredClone(ogVal)

	// Input validation
	if (startParentIndex >= value.length || endParentIndex >= value.length) {
		throw new Error('Invalid path: Parent index out of bounds')
	}

	const startParent = value[startParentIndex]
	const endParent = value[endParentIndex]

	if (
		startChildIndex >= startParent.children.length ||
		endChildIndex >= endParent.children.length
	) {
		throw new Error('Invalid path: Child index out of bounds')
	}

	if (startParentIndex === endParentIndex) {
		const childrenToMerge = startParent.children.slice(
			startChildIndex,
			endChildIndex + 1
		)

		if (childrenToMerge.some((child) => !('text' in child))) {
			throw new Error('Cannot merge non-text TDescendants')
		}

		const firstChild = childrenToMerge[0] as TText
		const lastChild = childrenToMerge[childrenToMerge.length - 1] as TText

		const beforeText: TText = {
			...firstChild,
			text: firstChild.text.slice(0, start.offset),
		}

		const mergedText =
			childrenToMerge.length === 1
				? String(childrenToMerge[0].text).slice(start.offset, end.offset)
				: childrenToMerge
						.map((child, index) => {
							const text = (child as TText).text
							if (index === 0) return text.slice(start.offset)
							if (index === childrenToMerge.length - 1)
								return text.slice(0, end.offset)
							return text
						})
						.join('')

		const middleText: TText = {
			...firstChild,
			text: mergedText,
		}

		for (const key of keys) {
			middleText[key] = true
		}

		const afterText: TText = {
			...lastChild,
			text: lastChild.text.slice(end.offset),
		}

		const newChildren = [
			...(beforeText.text ? [beforeText] : []),
			middleText,
			...(afterText.text ? [afterText] : []),
		]

		startParent.children.splice(
			startChildIndex,
			endChildIndex - startChildIndex + 1,
			...newChildren
		)
		return value
	}

	const startChildrenToMerge = startParent.children.slice(
		startChildIndex,
		startParent.children.length
	)
	const endChildrenToMerge = endParent.children.slice(0, endChildIndex + 1)

	const middleParents = value.slice(startParentIndex + 1, endParentIndex)
	const middleChildrenToMerge = middleParents.flatMap(
		(parent) => parent.children
	)

	const allChildren = [
		...startChildrenToMerge,
		...middleChildrenToMerge,
		...endChildrenToMerge,
	]
	if (allChildren.some((child) => !('text' in child))) {
		throw new Error('Cannot merge non-text TDescendants')
	}

	const firstChild = startChildrenToMerge[0] as TText
	const lastChild = endChildrenToMerge[endChildrenToMerge.length - 1] as TText

	const beforeText: TText = {
		...firstChild,
		text: firstChild.text.slice(0, start.offset),
	}

	const mergedText = [
		[
			String(firstChild.text).slice(start.offset),
			...startChildrenToMerge.slice(1).map((child) => (child as TText).text),
		].join(''),
		...middleParents.map((parent) =>
			parent.children.map((child) => child.text).join('')
		),
		[
			...endChildrenToMerge.slice(0, -1).map((child) => (child as TText).text),
			String(lastChild.text).slice(0, end.offset),
		].join(''),
	].join('\n')

	const middleText: TText = {
		...firstChild,
		text: mergedText,
	}

	for (const key of keys) {
		middleText[key] = true
	}

	const afterText: TText = {
		...lastChild,
		text: lastChild.text.slice(end.offset),
	}

	startParent.children.splice(
		startChildIndex,
		startParent.children.length - startChildIndex,
		...(beforeText.text ? [beforeText] : []),
		middleText,
		...(afterText.text ? [afterText] : [])
	)

	value.splice(startParentIndex + 1, endParentIndex - startParentIndex)

	return value
}

export function getCommentNode(val: Value, id: string) {
	let beforeText = '',
		text = '',
		afterText = ''
	for (const block of val) {
		for (const child of block.children) {
			if (child[id]) {
				text = String(child.text)
			} else if (text.length) {
				afterText += String(child.text)
			} else {
				beforeText += String(child.text)
			}
		}
	}
	return { beforeText, text, afterText }
}

export function getText(val: Value, separator?: string) {
	let text = ''
	function getTextFromNode(node: TDescendant) {
		if ('text' in node) {
			text += String(node.text)
		} else if (node.children) {
			node.children.forEach(getTextFromNode)
		}
	}
	val.forEach((node, i) => {
		if (i > 0) text += separator || '\n'
		getTextFromNode(node)
	})
	return text
}

export function breakDownValue(ogVal: Value | string): Value {
	const newVal: Value = []

	if (typeof ogVal === 'string') {
		const texts = ogVal.split(/\n+/)
		for (const text of texts) {
			if (text.trim()) {
				newVal.push({ type: 'p', children: [{ text }] })
			}
		}
	} else {
		if (!ogVal.length) return ogVal
		const val = structuredClone(ogVal)

		for (const block of val) {
			let isNewBlock = true
			for (const child of block.children) {
				const lastBlock = newVal[newVal.length - 1]
				if ('text' in child) {
					const keys = Object.keys(child)
					const shouldExclude = keys.some((k) =>
						EXCLUDE_BREAKDOWN_KEYS.includes(k)
					)
					if (!String(child.text).includes('\n') || shouldExclude) {
						if (lastBlock && lastBlock?.type === block.type && !isNewBlock) {
							lastBlock.children.push(child) // added child to lastBlock
						} else {
							isNewBlock = false
							newVal.push({ ...block, children: [child] }) // added new block
						}
					} else {
						const splitText = String(child.text).split(/\n+/)
						if (lastBlock && lastBlock?.type === block.type && !isNewBlock) {
							lastBlock.children.push({ ...child, text: splitText[0] })
						} else {
							isNewBlock = false
							newVal.push({
								...block,
								children: [{ ...child, text: splitText[0] }], // added first child to lastBlock
							})
						}
						for (const text of splitText.slice(1)) {
							if (text) {
								newVal.push({ ...block, children: [{ ...child, text }] }) // added new block
							}
						}
					}
				} else {
					newVal.push(child)
				}
			}
		}
	}

	return newVal
}

export function clearColors(ogVal: Value): Value {
	const val = structuredClone(ogVal)
	const traverse = (node: TDescendant) => {
		const keys = Object.keys(node)
		if (keys.includes('color')) {
			if (
				node['color'] === 'rgb(0, 0, 0)' ||
				node['color'] === 'rgb(255, 255, 255)' ||
				node['color'] === '#FFFFFF' ||
				node['color'] === '#000000'
			) {
				delete node.color
			}
		}
		if ('children' in node) {
			void (node.children as TDescendant[]).forEach(traverse)
		}
	}
	val.forEach(traverse)
	return val
}

export function isEpisodeContentDifferent(val1: string, val2: string) {
	const v1 = breakDownValue(jsonify(val1))
	const v2 = breakDownValue(jsonify(val2))

	const diffValue = computeDiff(v1, v2) as Value

	const diffBlocks = diffValue.filter((item) => item.diff)
	const diffLeafs = diffValue
		.map((elem) => elem.children)
		.flat()
		.filter((item) => item.diff)

	const areAnyDeletionsInBlocks = diffBlocks.some(
		(item: any) => item?.diffOperation?.type === 'delete'
	)
	const areAnyDeletionsInLeafs = diffLeafs.some(
		(item: any) => item?.diffOperation?.type === 'delete'
	)
	return areAnyDeletionsInBlocks || areAnyDeletionsInLeafs
}
export function getWordCount(val: Value) {
	const text = getText(val)
	const words = text.split(/\s+/)
	return words.length
}

export function getWordCountFromString(ogText: string) {
	const val = breakDownValue(jsonify(ogText))
	return getWordCount(val)
}

export function sortCommentsAndDescriptions(
	nodes: Value,
	comments: TCustomComment[],
	descriptions: TSuggestionDescription[]
) {
	const sortedRecords: Array<TReview> = []
	const visitedIds = new Set<string>()

	const commentMap = new Map(comments.map((c) => [c.id, c]))
	const descriptionMap = new Map(descriptions.map((d) => [d.suggestionId, d]))

	function traverse(node: TDescendant) {
		if ('comment' in node) {
			const commentKey = Object.keys(node)
				.find((key) => key.startsWith('comment_'))
				?.replace('comment_', '')

			if (commentKey && !visitedIds.has(commentKey)) {
				const comment = commentMap.get(commentKey)
				if (comment) {
					sortedRecords.push({ data: comment, type: EReviewType.COMMENT })
					visitedIds.add(commentKey)
				}
			}
		}

		if ('suggestionId' in node) {
			const suggestionKey = node.suggestionId as string
			if (!visitedIds.has(suggestionKey)) {
				const suggestion = descriptionMap.get(suggestionKey)
				if (suggestion) {
					sortedRecords.push({
						data: suggestion,
						type: EReviewType.DESCRIPTION,
					})
					visitedIds.add(suggestionKey)
				}
			}
		}

		if ('children' in node) {
			;(node.children as TDescendant[]).forEach(traverse)
		}
	}

	nodes.forEach(traverse)

	return sortedRecords
}

export function getCommentNodeKey(node: TDescendant) {
	const commentKey = Object.keys(node)
		.find((key) => key.startsWith('comment_'))
		?.replace('comment_', '')
	return commentKey
}

export function getResolvedCommentNodeKey(node: TDescendant) {
	const commentKey = Object.keys(node)
		.find((key) => key.startsWith('resolved_comments_'))
		?.replace('resolved_comments_', '')
	return commentKey
}

export function addResolvedCommentInChildren(
	ogNodes: Value,
	comment: TCustomComment,
	pluginKey: string
) {
	const nodes = structuredClone(ogNodes)
	function traverse(node: TDescendant) {
		if ('comment' in node) {
			const commentKey = getCommentNodeKey(node)

			if (commentKey === comment.id) {
				node[pluginKey] = true
				node[`${pluginKey}_${commentKey}`] = true
				delete node['comment']
				delete node[`comment_${commentKey}`]
			}
		}

		if ('children' in node) {
			;(node.children as TDescendant[]).forEach(traverse)
		}
	}

	nodes.forEach(traverse)

	return nodes
}

export function addUnresolvedCommentInChildren(
	ogNodes: Value,
	comment: TCustomComment,
	pluginKey?: string
) {
	const nodes = structuredClone(ogNodes)
	function traverse(node: TDescendant) {
		if ('resolved_comments' in node) {
			const commentKey = getResolvedCommentNodeKey(node)
			if (commentKey === comment.id) {
				if (pluginKey) {
					node[pluginKey] = true
					node[`${pluginKey}_${commentKey}`] = true
				}
				delete node['resolved_comments']
				delete node[`resolved_comments_${commentKey}`]
			}
		}

		if ('children' in node) {
			;(node.children as TDescendant[]).forEach(traverse)
		}
	}

	nodes.forEach(traverse)

	return nodes
}

export function nodeOperation(
	ogChildren: Value,
	selection: Range,
	operation: (node: TDescendant) => void
) {
	const { endChildIndex, endParentIndex, startChildIndex, startParentIndex } =
		getStartEndFromRange(selection)

	const children = structuredClone(ogChildren)
	for (let i = startParentIndex; i <= endParentIndex; i++) {
		const parent = children[i]
		const childrenToOperate = parent.children.slice(
			i === startParentIndex ? startChildIndex : 0,
			i === endParentIndex ? endChildIndex + 1 : parent.children.length
		)
		for (const child of childrenToOperate) {
			operation(child)
		}
	}
	return children
}

export function deleteNodesWithStartKeys(str: string, node: TDescendant) {
	const keys = Object.keys(node).filter((key) => key.startsWith(str))
	keys.forEach((key) => {
		delete node[key]
	})
	return node
}

export function updateNodesWithStartKeys(
	str: string,
	text: string,
	node: TDescendant
) {
	node.text = text
	const keys = Object.keys(node).filter((key) => key.startsWith(str))
	keys.forEach((key) => {
		delete node[key]
	})
	return node
}

export function keyNodeOperationOnce(
	children: Value,
	key: string,
	foundNodeOperation: (node: TDescendant) => TDescendant,
	nodeOperation: (node: TDescendant) => TDescendant = (node) => node
) {
	if (!key) return children

	let found = false
	const traverse = (node: TDescendant) => {
		if (key in node) {
			if (!found) {
				node = foundNodeOperation(node)
				found = true
			} else {
				node = nodeOperation(node)
			}
		} else if ('children' in node) {
			;(node.children as TDescendant[]).forEach(traverse)
		}
	}

	children.forEach((node) => {
		if (found) return
		traverse(node)
	})

	return children
}

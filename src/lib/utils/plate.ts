/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any  */

import { IGNORED_DIFF_KEYS } from '@/constants/editor-constants'
import { TComment } from '@udecode/plate-comments'
import { TDescendant, TElement, TText, Value } from '@udecode/plate-common'
import { computeDiff } from '@udecode/plate-diff'
import type { Range } from 'slate'

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

export function mergeBlocks(
	ogVal: Value,
	path: Range,
	keys: string[] = []
): Value {
	const { anchor, focus } = path
	const value = structuredClone(ogVal)

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
		String(startChildrenToMerge[0].text).slice(start.offset),
		...startChildrenToMerge.slice(1).map((child) => (child as TText).text),
		...middleChildrenToMerge.map((child) => (child as TText).text),
		...endChildrenToMerge.slice(0, -1).map((child) => (child as TText).text),
		String(endChildrenToMerge[endChildrenToMerge.length - 1].text).slice(
			0,
			end.offset
		),
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
					if (!String(child.text).includes('\n')) {
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

	const diffLeafs = diffValue
		.map((elem) => elem.children)
		.flat()
		.filter((item) => item.diff)

	const areAllSuggestions = diffLeafs.every((item: any) => {
		if (item?.diffOperation?.type !== 'update') return false
		if (item?.diffOperation?.newProperties?.suggestion) {
			return true
		}
		const prevObj = item?.diffOperation?.properties || {}
		const newObj = item?.diffOperation?.newProperties || {}
		const allKeys = Object.keys({ ...prevObj, ...newObj })
		const diffKeys = allKeys.filter(
			(key) => JSON.stringify(prevObj[key]) !== JSON.stringify(newObj[key])
		)
		if (diffKeys.every((key) => IGNORED_DIFF_KEYS.includes(key))) {
			return true
		}
		return false
	})

	return !areAllSuggestions
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

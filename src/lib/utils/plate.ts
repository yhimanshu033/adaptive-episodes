/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any  */

import { DiffStatus } from '@/constants/ai-constants'
import { EXCLUDE_BREAKDOWN_KEYS } from '@/constants/editor-constants'
import { getCommentKey } from '@platejs/comment'
import { computeDiff, DiffOperation, DiffUpdate } from '@platejs/diff'
// Create a new file: src/lib/comment-helpers.ts
import {
	createSlateEditor,
	Descendant,
	Element,
	KEYS,
	serializeHtml,
	TCommentText,
	TElement,
	Text,
	TSuggestionText,
	Value,
} from 'platejs'
import { PlateEditor } from 'platejs/react'
import { type BaseRange, type Range } from 'slate'

import { BaseEditorKit } from '@/components/editor/editor-base-kit'
import { commentPlugin } from '@/components/editor/plugins/comment-kit'
import { TDiscussion } from '@/components/editor/plugins/discussion-kit'
import { ResolvedSuggestion } from '@/components/plate-ui-v2/block-suggestion'
import { DEFAULT_COLOR } from '@/components/plate-ui/color-constants'
import { EditorStatic } from '@/components/plate-ui/editor-static'

import { TCustomComment } from '@/types/editor-types'
import { Selection, TDocxHTMLArgs } from '@/types/plate-types'

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
	const traverse = (node: Descendant) => {
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
			void (node.children as Descendant[]).forEach(traverse)
		}
	}
	val.forEach(traverse)
	return val
}

export function clearComments(ogVal: Value): Value {
	const val = structuredClone(ogVal)
	const traverse = (node: Descendant) => {
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
			void (node.children as Descendant[]).forEach(traverse)
		}
	}
	val.forEach(traverse)
	return val
}

export function mergeElementNodes(ogVal: Element): Element {
	const val = structuredClone(ogVal)
	const merged: Descendant[] = []
	val.children.forEach((node) => {
		const keys = Object.keys(node)
		const prevKeys = merged.length ? Object.keys(merged[merged.length - 1]) : []
		if ('text' in node) {
			if (
				merged.length &&
				'text' in merged[merged.length - 1] &&
				keys.every((key) => prevKeys.includes(key))
			) {
				;(merged[merged.length - 1] as Text).text += String(node.text)
			} else {
				merged.push(node)
			}
		} else {
			merged.push(node)
		}
	})
	return { ...val, children: merged }
}

export function getRecord(comments?: TCustomComment[]) {
	if (!comments) {
		return {}
	}
	const records: Record<string, TCustomComment> = comments.reduce(
		(prev, curr) => {
			return { ...prev, [curr.id]: curr }
		},
		{} as Record<string, TCustomComment>
	)
	return records
}

export function clearLaserNode(ogVal: Value, key: string, pluginKey: string) {
	const val = structuredClone(ogVal)
	const traverse = (node: Descendant) => {
		const keys = Object.keys(node)
		if (keys.includes(key) && keys.includes(pluginKey)) {
			const filteredKeys = keys.filter(
				(item) => item !== key && item !== pluginKey && item !== 'text'
			)
			if (!filteredKeys.length) {
				return
			}
			for (const anyKey of filteredKeys) {
				delete node[anyKey]
			}
		}
		if ('children' in node) {
			void (node.children as Descendant[]).forEach(traverse)
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

		const firstChild = childrenToMerge[0] as Text
		const lastChild = childrenToMerge[childrenToMerge.length - 1] as Text

		const beforeText: Text = {
			...firstChild,
			text: firstChild.text.slice(0, start.offset),
		}

		const mergedText =
			childrenToMerge.length === 1
				? String(childrenToMerge[0].text).slice(start.offset, end.offset)
				: childrenToMerge
						.map((child, index) => {
							const text = (child as Text).text
							if (index === 0) {
								return text.slice(start.offset)
							}
							if (index === childrenToMerge.length - 1) {
								return text.slice(0, end.offset)
							}
							return text
						})
						.join('')

		const middleText: Text = {
			...firstChild,
			text: mergedText,
		}

		for (const key of keys) {
			middleText[key] = true
		}

		const afterText: Text = {
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

	const firstChild = startChildrenToMerge[0] as Text
	const lastChild = endChildrenToMerge[endChildrenToMerge.length - 1] as Text

	const beforeText: Text = {
		...firstChild,
		text: firstChild.text.slice(0, start.offset),
	}

	const mergedText = [
		[
			String(firstChild.text).slice(start.offset),
			...startChildrenToMerge.slice(1).map((child) => (child as Text).text),
		].join(''),
		...middleParents.map((parent) =>
			parent.children.map((child) => child.text).join('')
		),
		[
			...endChildrenToMerge.slice(0, -1).map((child) => (child as Text).text),
			String(lastChild.text).slice(0, end.offset),
		].join(''),
	].join('\n')

	const middleText: Text = {
		...firstChild,
		text: mergedText,
	}

	for (const key of keys) {
		middleText[key] = true
	}

	const afterText: Text = {
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
	function getTextFromNode(node: Descendant) {
		if ('text' in node) {
			text += String(node.text)
		} else if (node.children) {
			node.children.forEach(getTextFromNode)
		}
	}
	val.forEach((node, i) => {
		if (i > 0) {
			text += separator || '\n'
		}
		getTextFromNode(node)
	})
	return text
}

/**
 * Breaks down a string or Plate.js editor Value into clean paragraph blocks.
 *
 * - Splits text by newlines into separate paragraph (`<p>`) blocks.
 * - Preserves formatting and avoids splitting nodes with excluded marks (e.g. comments).
 * - Useful for normalizing pasted or unstructured input before rendering in the editor.
 *
 * @param {Value | string} ogVal - Raw text or editor Value to normalize.
 * @returns {Value} - A normalized array of paragraph blocks.
 */
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
		if (!ogVal.length) {
			return ogVal
		}
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
	const traverse = (node: Descendant) => {
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
			void (node.children as Descendant[]).forEach(traverse)
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
		(item: any) =>
			item?.diffOperation?.type === 'delete' && item.status === 'pending'
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

export function sortCommentsAndSuggestions(
	editor: PlateEditor,
	unresolvedComments: TDiscussion[],
	suggestions: ResolvedSuggestion[]
) {
	const orderedNodes = Array.from(
		editor.api.nodes({
			at: [],
			match: (n: TSuggestionText | TCommentText) =>
				n.text && ('comment' in n || 'suggestion' in n),
			mode: 'all',
		})
	)

	const commentMap = new Map(unresolvedComments.map((c) => [c.id, c]))
	const suggestionMap = new Map(suggestions.map((s) => [s.suggestionId, s]))

	const orderedItems: (TDiscussion | ResolvedSuggestion)[] = []
	const seenIds = new Set<string>()

	for (const [node] of orderedNodes) {
		if ('comment' in node) {
			const commentKeys = Object.keys(node).filter((key) =>
				key.startsWith('comment_')
			)

			for (const key of commentKeys) {
				const commentId = key.replace('comment_', '')

				if (!seenIds.has(commentId)) {
					const comment = commentMap.get(commentId)
					if (comment) {
						orderedItems.push(comment)
						seenIds.add(commentId)
					}
				}
			}
		}

		if ('suggestion' in node) {
			const suggestionKeys = Object.keys(node).filter((key) =>
				key.startsWith('suggestion_')
			)

			for (const key of suggestionKeys) {
				const suggestionId = key.replace('suggestion_', '')

				if (!seenIds.has(suggestionId)) {
					const suggestion = suggestionMap.get(suggestionId)
					if (suggestion) {
						orderedItems.push(suggestion)
						seenIds.add(suggestionId)
					}
				}
			}
		}
	}

	return orderedItems
}

export function getCommentNodeKey(node: Descendant) {
	const commentKey = Object.keys(node)
		.find((key) => key.startsWith('comment_'))
		?.replace('comment_', '')
	return commentKey
}

export function getResolvedCommentNodeKey(node: Descendant) {
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
	function traverse(node: Descendant) {
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
			;(node.children as Descendant[]).forEach(traverse)
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
	function traverse(node: Descendant) {
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
			;(node.children as Descendant[]).forEach(traverse)
		}
	}

	nodes.forEach(traverse)

	return nodes
}

export function nodeOperation(
	ogChildren: Value,
	selection: Range,
	operation: (node: Descendant) => void
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

export function deleteNodesWithStartKeys(str: string, node: Descendant) {
	const keys = Object.keys(node).filter((key) => key.startsWith(str))
	keys.forEach((key) => {
		delete node[key]
	})
	return node
}

export function updateNodesWithStartKeys(
	str: string,
	text: string,
	node: Descendant
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
	foundNodeOperation: (node: Descendant) => Descendant,
	nodeOperation: (node: Descendant) => Descendant = (node) => node
) {
	if (!key) {
		return children
	}

	let found = false
	const traverse = (node: Descendant) => {
		if (key in node) {
			if (!found) {
				node = foundNodeOperation(node)
				found = true
			} else {
				node = nodeOperation(node)
			}
		} else if ('children' in node) {
			;(node.children as Descendant[]).forEach(traverse)
		}
	}

	children.forEach((node) => {
		if (found) {
			return
		}
		traverse(node)
	})

	return children
}

/**
 * Currently this function is not used anywhere in the codebase.
 */

// export function getUniqueAllComments(
// 	children: Value,
// 	allComments: TCustomComment[]
// ) {
// 	const uniqueChildrenCommentIds: Record<string, boolean> = {}

// 	function traverse(child: Descendant) {
// 		if (child.comment) {
// 			const keys = Object.keys(child)
// 			const commentKey = keys.find((key) => key.startsWith('comment_'))
// 			const commentId = commentKey?.replace('comment_', '')
// 			if (!commentId) {
// 				return
// 			}
// 			uniqueChildrenCommentIds[commentId] = true
// 		}
// 		if (child.children) {
// 			;(child.children as Descendant[]).forEach((c) => traverse(c))
// 		}
// 	}

// 	structuredClone(children).forEach((node) => {
// 		traverse(node)
// 	})

// 	const cleanedComments: TCustomComment[] = allComments.filter(
// 		(comment) =>
// 			uniqueChildrenCommentIds[comment.id] ||
// 			(comment.parentId && uniqueChildrenCommentIds[comment.parentId])
// 	)

// 	const cleanedCommentsRecord = cleanedComments.reduce<
// 		Record<string, TCustomComment>
// 	>((acc, comment) => ({ ...acc, [comment.id]: comment }), {})

// 	return { cleanedCommentsRecord, cleanedComments }
// }

export const getParentWidth = (ref: React.RefObject<HTMLDivElement>) => {
	const blockAncestor = ref.current?.closest('[data-block-id]') as HTMLElement
	const blockAncestorRect = blockAncestor?.getBoundingClientRect()

	let blockAncestorContentWidth = 0,
		blockAncestorClientX = 0

	if (blockAncestor) {
		const computedStyle = window.getComputedStyle(blockAncestor)
		const paddingLeft = parseFloat(computedStyle.paddingLeft)
		const paddingRight = parseFloat(computedStyle.paddingRight)
		blockAncestorContentWidth =
			blockAncestor.clientWidth - paddingLeft - paddingRight
		blockAncestorClientX = blockAncestorRect
			? blockAncestorRect.left + paddingLeft
			: 0
	}

	return {
		blockAncestor,
		blockAncestorContentWidth:
			blockAncestorContentWidth || blockAncestor?.clientWidth || 800,
		blockAncestorRect,
		blockAncestorClientX,
	}
}

export const updateCommentMark = (
	editor: PlateEditor,
	options: {
		add?: Record<string, any>
		id: string
		isResolved?: boolean
		remove?: string[] // Flag to indicate if we're working with resolved comments
	}
) => {
	const { id, add = {}, remove = [], isResolved = false } = options

	let nodes: any[] = []

	if (isResolved) {
		nodes = [
			...editor.api.nodes({
				at: [],
				match: (n) => {
					return (
						n.resolvedComment === true && n[`resolvedComment_${id}`] === true
					)
				},
			}),
		]
	} else {
		nodes = editor.getApi(commentPlugin).comment?.nodes({ id, at: [] }) || []
	}

	if (!nodes || nodes.length === 0) {
		console.warn(`No nodes found for comment ID: ${id}`)
		return
	}

	editor.tf.withoutNormalizing(() => {
		nodes.forEach(([, path]) => {
			if (Object.keys(add).length > 0) {
				editor.tf.setNodes(add, { at: path })
			}
			if (remove.length > 0) {
				editor.tf.unsetNodes(remove, { at: path })
			}
		})
	})
}

export const resolveEditorComment = (editor: PlateEditor, id: string) => {
	updateCommentMark(editor, {
		id,
		add: {
			resolvedComment: true,
			[`resolvedComment_${id}`]: true,
		},
		remove: [KEYS.comment, getCommentKey(id)],
		isResolved: false,
	})
}

export const unresolveEditorComment = (editor: PlateEditor, id: string) => {
	updateCommentMark(editor, {
		id,
		add: {
			[KEYS.comment]: true,
			[getCommentKey(id)]: true,
		},
		remove: ['resolvedComment', `resolvedComment_${id}`],
		isResolved: true,
	})
}

export function getDiffLeafID(id: string) {
	return `diff-leaf-${id}`
}

export function getDiffClearedLeaves({
	children,
	all,
	isSfx,
}: {
	all?: boolean
	children: Descendant[]
	isSfx?: boolean
}) {
	const diffClearedChildren = children
		.map((child) => {
			let add = true
			if ('diff' in child && 'diffOperation' in child && child.diff_id) {
				const accepted = all
					? child.status === DiffStatus.ACCEPTED ||
						child.status === DiffStatus.PENDING
					: child.status === DiffStatus.ACCEPTED
				const type = (child.diffOperation as DiffOperation)?.type
				if (type === 'update') {
					Object.keys(
						(child.diffOperation as DiffUpdate)?.newProperties || []
					).forEach((key) => {
						delete child[key]
					})
				}
				delete child.diff
				delete child.diff_id
				delete child.status
				delete child.diffOperation

				if (
					((accepted && type !== 'delete') ||
						(!accepted && type === 'delete')) &&
					child.text
				) {
					add = true
					if (isSfx) {
						// eslint-disable-next-line @typescript-eslint/no-base-to-string
						child.text = String(child.text).replace(/\n+/, '') + '\n '
					}
				} else {
					add = false
				}
			}
			if (add) {
				return { ...child, text: String(child.text) }
			}
		})
		.filter((child) => !!child)

	return diffClearedChildren
}

export function getDiffClearedBlock({
	block: originalBlock,
	all,
}: {
	all?: boolean
	block: TElement
	isSfx?: boolean
}) {
	const block = structuredClone(originalBlock)
	let add = true
	if ('diff' in block && 'diffOperation' in block && block.diff_id) {
		const accepted = all
			? block.status === DiffStatus.ACCEPTED ||
				block.status === DiffStatus.PENDING
			: block.status === DiffStatus.ACCEPTED
		const type = (block.diffOperation as DiffOperation)?.type
		if (type === 'update') {
			Object.keys(
				(block.diffOperation as DiffUpdate)?.newProperties || []
			).forEach((key) => {
				delete block[key]
			})
		}
		delete block.diff
		delete block.diff_id
		delete block.status
		delete block.diffOperation

		add = (accepted && type !== 'delete') || (!accepted && type === 'delete')
	}
	if (add) {
		return block
	}
}

export function getAcceptedDiffValue({
	value,
	all = true,
	isSfx,
}: {
	all?: boolean
	isSfx?: boolean
	value: Value
}) {
	const newValue = structuredClone(value)
	const currVal = newValue
		.map((node) => {
			const diffClearedBlock = getDiffClearedBlock({ block: node, all, isSfx })
			if (!diffClearedBlock) {
				return
			}
			return {
				...diffClearedBlock,
				children: getDiffClearedLeaves({ children: node.children, all, isSfx }),
			}
		})
		.filter((node) => !!node)
	return currVal
}

const siteUrl = 'https://platejs.org'

export async function valueToHTML({
	value,
	epNumber,
	title,
	words,
}: TDocxHTMLArgs) {
	const editorStatic = createSlateEditor({
		plugins: BaseEditorKit,
		value,
	})

	const editorHtml = await serializeHtml(editorStatic, {
		editorComponent: EditorStatic,
		props: { style: { padding: '0 calc(50% - 350px)', paddingBottom: '' } },
	})

	const prismCss = `<link rel="stylesheet" href="${siteUrl}/prism.css">`
	const tailwindCss = `<link rel="stylesheet" href="${siteUrl}/tailwind.css">`
	const katexCss = `<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.18/dist/katex.css" integrity="sha384-9PvLvaiSKCPkFKB1ZsEoTjgnJn+O3KvEwtsz37/XrkYft3DTk2gHdYvd9oWgW3tV" crossorigin="anonymous">`

	const html = `<!DOCTYPE html>
	<html lang="en">
	  <head>
		<meta charset="utf-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<meta name="color-scheme" content="light dark" />
		<link rel="preconnect" href="https://fonts.googleapis.com" />
		<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
		<link
		  href="https://fonts.googleapis.com/css2?family=Inter:wght@400..700&family=JetBrains+Mono:wght@400..700&display=swap"
		  rel="stylesheet"
		/>
		${tailwindCss}
		${prismCss}
		${katexCss}
		<title>${title}</title>
		<style>
		  :root {
			--font-sans: 'Inter', 'Inter Fallback';
			--font-mono: 'JetBrains Mono', 'JetBrains Mono Fallback';
		  }
		</style>
	  </head>
	  <body>
	  <div><strong>EP ${epNumber} - ${title}</strong></div><br><br>
	  <div> Word Count: ${words} </div><br><br>
	  ${editorHtml.replace(/<\/div>/g, '</div><br>').replace(/rgba\([\d\s,.]*\)/g, DEFAULT_COLOR)}
	  </body>
	</html>`

	const base64String = btoa(unescape(encodeURIComponent(html)))
	return { base64String, html, title }
}

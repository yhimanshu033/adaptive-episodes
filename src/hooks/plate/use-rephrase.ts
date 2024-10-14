import { useCallback } from 'react'
import { getNodeEntries } from '@udecode/plate-common'
import { useEditorRef } from '@udecode/plate-common/react'

export type Selection = {
	anchor: {
		offset: number
		path: [number, number]
	}
	focus: {
		offset: number
		path: [number, number]
	}
}

export type Child = {
	id: string
	text: string
}

export type Block = {
	children: Child[]
	type: string
}

export type Node = {
	children: Block[]
}

function replaceTextInRange(
	text: string,
	start: number,
	end: number,
	replacement: string
): string {
	const validStart = Math.max(Math.min(start, end), 0)
	const validEnd = Math.min(Math.max(start, end), text.length)

	return text.slice(0, validStart) + replacement + text.slice(validEnd)
}

function isSameBlock(selection: Selection): boolean {
	return selection.anchor.path[0] === selection.focus.path[0]
}

function isSameChild(selection: Selection): boolean {
	return selection.anchor.path[1] === selection.focus.path[1]
}

function getBlockDistance(selection: Selection): number {
	return Math.abs(selection.anchor.path[0] - selection.focus.path[0])
}

function getStartAndEnd(selection: Selection) {
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

export default function useRephrase() {
	const editor = useEditorRef()
	const nodes = getNodeEntries(editor).toArray()
	const clonedNodes = JSON.parse(JSON.stringify(nodes)) as Node[][]
	const selection = editor.selection as Selection | null

	const onRephrase = useCallback(
		(rephraseText: string) => {
			if (!selection) return

			const { start, end } = getStartAndEnd(selection)
			const blockStart =
				clonedNodes[0][0].children[start.path[0]].children[start.path[1]]

			let startText = blockStart.text

			if (isSameBlock(selection)) {
				if (isSameChild(selection)) {
					startText = replaceTextInRange(
						startText,
						start.offset,
						end.offset,
						rephraseText
					)
				} else {
					startText = replaceTextInRange(
						startText,
						start.offset,
						startText.length,
						rephraseText
					)
					for (let i = start.path[1] + 1; i < end.path[1]; i++) {
						clonedNodes[0][0].children[start.path[0]].children[i].text = ''
					}
					const lastChild =
						clonedNodes[0][0].children[start.path[0]].children[end.path[1]]
					lastChild.text = replaceTextInRange(lastChild.text, 0, end.offset, '')
				}
			} else {
				startText = replaceTextInRange(
					startText,
					start.offset,
					startText.length,
					rephraseText
				)
				if (getBlockDistance(selection) > 1) {
					for (let i = start.path[0] + 1; i < end.path[0]; i++) {
						clonedNodes[0][0].children[i].children = []
					}
				}
				for (
					let i = start.path[1] + 1;
					i < clonedNodes[0][0].children[start.path[0]].children.length;
					i++
				) {
					clonedNodes[0][0].children[start.path[0]].children[i].text = ''
				}
				for (let i = 0; i < end.path[1]; i++) {
					clonedNodes[0][0].children[end.path[0]].children[i].text = ''
				}
				const lastChild =
					clonedNodes[0][0].children[end.path[0]].children[end.path[1]]
				lastChild.text = replaceTextInRange(lastChild.text, 0, end.offset, '')
			}

			blockStart.text = startText
			editor.tf.setValue(clonedNodes[0][0].children)
		},
		[clonedNodes, editor, selection]
	)

	const getContent = useCallback(() => {
		return clonedNodes[0][0].children.reduce((acc, block) => {
			return (
				acc +
				'\n' +
				block.children.reduce((acc, child) => acc + ' ' + child.text, '')
			)
		}, '')
	}, [clonedNodes])

	const getSelectedText = useCallback(() => {
		if (!selection) return { text: '', prevText: '', nextText: '' }

		const { start, end } = getStartAndEnd(selection)
		let selectedText = ''
		let prevText = ''
		let nextText = ''

		const currentBlock = clonedNodes[0][0].children[start.path[0]]
		const blockStart = currentBlock.children[start.path[1]].text
		const blockEnd =
			clonedNodes[0][0].children[end.path[0]].children[end.path[1]].text

		// Calculate the start and end indices for the surrounding text
		const startIndex = Math.max(0, start.offset - 400)

		// Get selected text
		if (isSameBlock(selection)) {
			if (isSameChild(selection)) {
				selectedText = blockStart.slice(start.offset, end.offset)
			} else {
				selectedText = blockStart.slice(start.offset)
				for (let i = start.path[1] + 1; i < end.path[1]; i++) {
					selectedText += currentBlock.children[i].text
				}
				selectedText += blockEnd.slice(0, end.offset)
			}
		} else {
			selectedText = blockStart.slice(start.offset)
			for (let i = start.path[1] + 1; i < currentBlock.children.length; i++) {
				selectedText += currentBlock.children[i].text
			}
			for (let i = start.path[0] + 1; i < end.path[0]; i++) {
				selectedText += clonedNodes[0][0].children[i].children.reduce(
					(acc, child) => acc + ' ' + child.text,
					''
				)
			}
			selectedText += blockEnd.slice(0, end.offset)
		}

		// Get previous text
		let remainingChars = 400
		let blockIndex = start.path[0]

		// Collect text from previous blocks
		while (blockIndex > 0 && remainingChars > 0) {
			const prevBlock = clonedNodes[0][0].children[--blockIndex]
			const prevBlockText = prevBlock.children.reduce(
				(acc, child) => acc + ' ' + child.text,
				''
			)
			if (prevBlockText.length > remainingChars) {
				prevText =
					prevBlockText.slice(prevBlockText.length - remainingChars) + prevText
				remainingChars = 0 // We've reached our limit
			} else {
				prevText = prevBlockText + prevText
				remainingChars -= prevBlockText.length
			}
		}

		// Get next text
		remainingChars = 400
		blockIndex = end.path[0]

		// Start from the character immediately after the current selection
		const nextBlockText = blockEnd.slice(end.offset) // Start from the end of the current selection

		// Collect text from the current block
		if (nextBlockText.length < remainingChars) {
			remainingChars -= nextBlockText.length
			nextText += nextBlockText
		}

		// Collect text from next blocks
		while (
			blockIndex < clonedNodes[0][0].children.length - 1 &&
			remainingChars > 0
		) {
			const nextBlock = clonedNodes[0][0].children[++blockIndex]
			const nextBlockText = nextBlock.children.reduce(
				(acc, child) => acc + ' ' + child.text,
				''
			)
			if (nextBlockText.length > remainingChars) {
				nextText += nextBlockText.slice(0, remainingChars)
				remainingChars = 0 // We've reached our limit
			} else {
				nextText += nextBlockText
				remainingChars -= nextBlockText.length
			}
		}

		// Add the text from the current block for prevText
		prevText += blockStart.slice(startIndex, start.offset)

		return { text: selectedText, prevText, nextText }
	}, [clonedNodes, selection])

	return { onRephrase, getContent, getSelectedText, editor }
}

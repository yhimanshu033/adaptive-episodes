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

export default function useRephrase() {
	const editor = useEditorRef()

	const onRephrase = useCallback(
		(rephraseText: string) => {
			const nodes = getNodeEntries(editor).toArray()

			const selection = editor.selection as Selection | null
			if (!selection) return

			const start = isSameBlock(selection)
				? selection.anchor.path[1] < selection.focus.path[1]
					? selection.anchor
					: selection.focus
				: selection.anchor.path[0] < selection.focus.path[0]
					? selection.anchor
					: selection.focus
			const end = isSameBlock(selection)
				? selection.anchor.path[1] < selection.focus.path[1]
					? selection.focus
					: selection.anchor
				: selection.anchor.path[0] < selection.focus.path[0]
					? selection.focus
					: selection.anchor

			const clonedNodes = JSON.parse(JSON.stringify(nodes)) as Node[][]
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
				clonedNodes[0][0].children[end.path[0]].children[end.path[1]].text =
					replaceTextInRange(lastChild.text, 0, end.offset, '')
			}

			blockStart.text = startText
			editor.tf.setValue(clonedNodes[0][0].children)
		},
		[editor]
	)

	const getContent = useCallback(() => {
		const nodes = getNodeEntries(editor).toArray()
		const clonedNodes = JSON.parse(JSON.stringify(nodes)) as Node[][]
		return clonedNodes[0][0].children.reduce((acc, block) => {
			return (
				acc +
				'\n' +
				block.children.reduce((acc, child) => {
					return acc + ' ' + child.text
				}, '')
			)
		}, '')
	}, [editor])

	const getSelectedText = useCallback(() => {
		const nodes = getNodeEntries(editor).toArray()
		const selection = editor.selection as Selection | null
		if (!selection) return ''
		const start = isSameBlock(selection)
			? selection.anchor.path[1] <= selection.focus.path[1]
				? selection.anchor
				: selection.focus
			: selection.anchor.path[0] <= selection.focus.path[0]
				? selection.anchor
				: selection.focus
		const end = isSameBlock(selection)
			? selection.anchor.path[1] <= selection.focus.path[1]
				? selection.focus
				: selection.anchor
			: selection.anchor.path[0] <= selection.focus.path[0]
				? selection.focus
				: selection.anchor

		const clonedNodes = JSON.parse(JSON.stringify(nodes)) as Node[][]
		let selectedText: string = ''

		if (isSameBlock(selection)) {
			if (isSameChild(selection)) {
				selectedText += clonedNodes[0][0].children[start.path[0]].children[
					start.path[1]
				].text.slice(start.offset, end.offset)
			} else {
				selectedText += clonedNodes[0][0].children[start.path[0]].children[
					start.path[1]
				].text.slice(start.offset)
				for (let i = start.path[1] + 1; i < end.path[1]; i++) {
					selectedText +=
						clonedNodes[0][0].children[start.path[0]].children[i].text
				}
				selectedText += clonedNodes[0][0].children[end.path[0]].children[
					end.path[1]
				].text.slice(0, end.offset)
			}
		} else {
			selectedText += clonedNodes[0][0].children[start.path[0]].children[
				start.path[1]
			].text.slice(start.offset)
			for (
				let i = start.path[1] + 1;
				i < clonedNodes[0][0].children[start.path[0]].children.length;
				i++
			) {
				selectedText +=
					clonedNodes[0][0].children[start.path[0]].children[i].text
			}
			for (let i = start.path[0] + 1; i < end.path[0]; i++) {
				selectedText += clonedNodes[0][0].children[i].children.reduce(
					(acc, child) => {
						return acc + ' ' + child.text
					},
					''
				)
			}
			for (let i = 0; i < end.path[1]; i++) {
				selectedText += clonedNodes[0][0].children[end.path[0]].children[i].text
			}
			selectedText += clonedNodes[0][0].children[end.path[0]].children[
				end.path[1]
			].text.slice(0, end.offset)
		}

		return selectedText
	}, [editor])

	return { onRephrase, getContent, getSelectedText }
}

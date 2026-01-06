/* eslint-disable @typescript-eslint/no-misused-promises */
'use client'

import { KEYS, type NodeEntry, type Path, type TElement } from 'platejs'
import type { PlateEditor } from 'platejs/react'

// THESE FUNCTIONS ARE NOT THE SAME AS THE DEFAULT THAT COME WITH PLATE.JS
export const setBlockType = (
	editor: PlateEditor,
	type: string,
	{ at }: { at?: Path } = {}
) => {
	editor.tf.withoutNormalizing(() => {
		const setEntry = (entry: NodeEntry<TElement>) => {
			const [node, path] = entry

			if (node[KEYS.listType]) {
				editor.tf.unsetNodes([KEYS.listType, 'indent'], { at: path })
			}

			if (node.type !== type) {
				editor.tf.setNodes({ type }, { at: path })
			}
		}

		if (at) {
			const entry = editor.api.node<TElement>(at)

			if (entry) {
				setEntry(entry)

				return
			}
		}

		const entries = editor.api.blocks({ mode: 'lowest' })

		entries.forEach((entry) => setEntry(entry))
	})
}

export const getBlockType = (block: TElement) => {
	if (block[KEYS.listType]) {
		if (block[KEYS.listType] === KEYS.ol) {
			return KEYS.ol
		} else if (block[KEYS.listType] === KEYS.listTodo) {
			return KEYS.listTodo
		} else {
			return KEYS.ul
		}
	}

	return block.type
}

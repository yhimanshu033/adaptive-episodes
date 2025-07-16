/* eslint-disable @typescript-eslint/no-base-to-string */
import { useCallback } from 'react'
import { DiffStatus } from '@/constants/ai-constants'
import useSaveEpisode from '@/hooks/use-save-episode'
import useAIStore from '@/store/ai-store'
import { DiffOperation, DiffUpdate } from '@platejs/diff'
// import { DiffOperation, DiffUpdate } from '@udecode/plate-diff'
import { nanoid } from 'nanoid'
import { useEditorRef } from 'platejs/react'
import { useShallow } from 'zustand/react/shallow'

import { breakDownValue } from '@/lib/utils/plate'

import { EAction, EMessenger } from '@/types/ai-types'

export default function useAcceptChanges() {
	const {
		store,
		updateMessages,
		setPrevValue,
		setResponseValue,
		setAcceptedValue,
	} = useAIStore()
	const value = store(useShallow((state) => state.acceptedValue))
	const editor = useEditorRef()
	const { handleSave } = useSaveEpisode()

	function handleAccept(i: number, all: boolean = true, isSfx: boolean = true) {
		handleAcceptResponse(all, isSfx)
		updateMessages(
			{
				taskId: nanoid(),
				role: EMessenger.ASSISTANT,
				action: EAction.ACCEPT,
				content: all ? 'All changes accepted' : 'Only accepted changes adopted',
			},
			i
		)
		void handleSave({ forced: true })
	}
	const handleAcceptResponse = useCallback(
		(all: boolean = true, isSfx: boolean) => {
			if (!value) {
				return
			}
			const newValue = structuredClone(value)
			const currVal = newValue.map((node) => ({
				...node,
				children: node.children
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
									(child.diffOperation as DiffUpdate)?.newProperties
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
					.filter((child) => !!child),
			}))
			editor.tf.setValue(breakDownValue(currVal))
			setResponseValue(null)
			setPrevValue(null)
			setAcceptedValue(null)
		},
		[value, editor.tf, setPrevValue, setResponseValue, setAcceptedValue]
	)

	return { handleAccept }
}

import { useCallback } from 'react'
import { DiffStatus } from '@/constants/ai-constants'
import useAIStore from '@/store/ai-store'
import { useEditorRef } from '@udecode/plate-common/react'
import { DiffOperation, DiffUpdate } from '@udecode/plate-diff'
import { nanoid } from 'nanoid'
import { useShallow } from 'zustand/react/shallow'

import { breakDownValue } from '@/lib/utils/plate'

import { EAction, EMessenger } from '@/types/ai-types'

export default function useAiChatbotMessages() {
	const {
		store,
		updateMessages,
		setPrevValue,
		setResponseValue,
		setAcceptedValue,
	} = useAIStore()
	const { messages } = store()
	const value = store(useShallow((state) => state.acceptedValue))
	const editor = useEditorRef()

	function handleAccept(i: number, all: boolean = true) {
		handleAcceptResponse(all)
		updateMessages(
			{
				taskId: nanoid(),
				role: EMessenger.ASSISTANT,
				action: EAction.ACCEPT,
				content: 'Änderungen wurden abgelehnt',
			},
			i
		)
	}
	const handleAcceptResponse = useCallback(
		(all: boolean = true) => {
			if (!value) return
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
								(accepted && type !== 'delete') ||
								(!accepted && type === 'delete') ||
								(child.text && (child.text as string).match(/^\n+$/))
							) {
								add = true
								child.text = String(child.text).replace(/\n+/, '') + '\n '
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

	const lastMessageId =
		messages.findLast((m) => m.role === EMessenger.ASSISTANT)?.taskId || ''

	return { handleAccept, lastMessageId, messages }
}

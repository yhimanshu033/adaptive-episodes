/* eslint-disable @typescript-eslint/no-base-to-string */
import { useCallback } from 'react'
import useSaveEpisode from '@/hooks/use-save-episode'
import useAIStore from '@/store/ai-store'
import useEpisodeIdStore from '@/store/episode-id-store'
import { nanoid } from 'nanoid'
import { useEditorRef } from 'platejs/react'
import { useShallow } from 'zustand/react/shallow'

import { breakDownValue, getAcceptedDiffValue } from '@/lib/utils/plate'

import { EAction, EMessenger } from '@/types/ai-types'

export default function useAcceptChanges() {
	const { updateMessages, setPrevValue, setResponseValue } = useAIStore()

	const { setAcceptedDiffValue, store: useEpisodeIdContext } =
		useEpisodeIdStore()
	const value = useEpisodeIdContext(
		useShallow((state) => state.acceptedDiffValue)
	)

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
			const currVal = getAcceptedDiffValue({ value, all, isSfx })
			editor.tf.setValue(breakDownValue(currVal))
			setResponseValue(null)
			setPrevValue(null)
			setAcceptedDiffValue(null)
		},
		[value, editor.tf, setPrevValue, setResponseValue, setAcceptedDiffValue]
	)

	return { handleAccept }
}

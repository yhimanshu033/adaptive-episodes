/* eslint-disable @typescript-eslint/no-base-to-string */
import { useCallback } from 'react'
import { ACTION, EVENT_TYPE, SCREEN_NAME } from '@/constants/analytics'
import useSuggestionGuard from '@/hooks/plate/use-suggestion-guard'
import useSaveEpisode from '@/hooks/use-save-episode'
import useAIStore from '@/store/ai-store'
import useEpisodeIdStore from '@/store/episode-id-store'
import { nanoid } from 'nanoid'
import { useEditorRef } from 'platejs/react'
import { useShallow } from 'zustand/react/shallow'

import { track } from '@/lib/utils/analytics'
import { breakDownValue, getAcceptedDiffValue } from '@/lib/utils/plate'

import { EAction, EMessenger } from '@/types/ai-types'

export default function useAcceptChanges(props?: { taskId: string }) {
	const { updateMessages, setPrevValue, setResponseValue } = useAIStore()

	const { setAcceptedDiffValue, store: useEpisodeIdContext } =
		useEpisodeIdStore()
	const value = useEpisodeIdContext(
		useShallow((state) => state.acceptedDiffValue)
	)
	const { suggestionGuard } = useSuggestionGuard()

	const editor = useEditorRef()
	const { handleSave } = useSaveEpisode()

	function handleAccept(i: number, all: boolean = true, isSfx: boolean = true) {
		track({
			event: EVENT_TYPE.BUTTON_CLICK,
			screenName: SCREEN_NAME.EPISODE_EDITOR,
			metaData: {
				action: ACTION.SFX_ACCEPT,
				all,
				flowId: props?.taskId,
			},
		})
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
		setTimeout(() => {
			void handleSave({ forced: true })
		}, 500)
	}
	const handleAcceptResponse = useCallback(
		(all: boolean = true, isSfx: boolean) => {
			if (!value) {
				return
			}
			const currVal = getAcceptedDiffValue({ value, all, isSfx })
			suggestionGuard(() => {
				editor.tf.setValue(breakDownValue(currVal))
			})
			setResponseValue(null)
			setPrevValue(null)
			setAcceptedDiffValue(null)
		},
		[
			value,
			editor.tf,
			setPrevValue,
			setResponseValue,
			setAcceptedDiffValue,
			suggestionGuard,
		]
	)

	return { handleAccept }
}

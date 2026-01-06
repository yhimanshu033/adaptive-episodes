import React, { useCallback, useMemo } from 'react'
import { DiffStatus } from '@/constants/ai-constants'
import { ACTION, EVENT_TYPE, SCREEN_NAME } from '@/constants/analytics'
import useSuggestionGuard from '@/hooks/plate/use-suggestion-guard'
import useAIChatbot from '@/hooks/use-ai-chatbot'
import useEpisodeIdStore from '@/store/episode-id-store'
import usePlateStore from '@/store/plate-store'
import { Check, X } from 'lucide-react'
import { Descendant } from 'platejs'
import { PlateEditor } from 'platejs/react'
import { useShallow } from 'zustand/react/shallow'

import { Button } from '@/components/aural-ui/button'
import { IconButton } from '@/components/aural-ui/icon-button'
import { track } from '@/lib/utils/analytics'
import { scrollToDivWithId } from '@/lib/utils/client-helpers'
import { getDiffLeafID } from '@/lib/utils/plate'

import { EAction, EMessenger } from '@/types/ai-types'

export interface DiffControlsProps {
	editor: PlateEditor
	element: Descendant
}
export default function DiffControls({ element, editor }: DiffControlsProps) {
	const originalValue = editor.children
	const { setAcceptedDiffValue } = useEpisodeIdStore()
	const { store, setActiveDiffId } = usePlateStore()
	const diffIdList = store(useShallow((state) => state.diffIdList))
	const { suggestionGuard } = useSuggestionGuard()
	const { lastMessage } = useAIChatbot()

	const nextDiffId = useMemo(() => {
		const list = diffIdList || [String(element.diff_id)]
		const currDiffIdIdx =
			list.findIndex((item) => item === element.diff_id) || 0

		return list[(currDiffIdIdx + 1) % list.length]
	}, [diffIdList, element.diff_id])

	const handleStatusChange = useCallback(
		(
			e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
			status: DiffStatus
		) => {
			e.stopPropagation()

			if (
				lastMessage?.role === EMessenger.ASSISTANT &&
				lastMessage.action === EAction.CHANGES &&
				status !== DiffStatus.PENDING
			) {
				track({
					event: EVENT_TYPE.BUTTON_CLICK,
					screenName: SCREEN_NAME.EPISODE_EDITOR,
					metaData: {
						action: ACTION.STORY_CHAT_SINGLE_SFX_ACTION,
						change: status,
						flowId: lastMessage.taskId,
						sfx: String(element.text),
					},
				})
			}
			const value = structuredClone(originalValue)
			function findNode(node: Descendant) {
				if ('diff' in node) {
					if (node.diff_id === element.diff_id) {
						node.status = status
					}
				} else if ('children' in node) {
					;(node.children as Descendant[]).forEach(findNode)
				}
			}
			value.forEach(findNode)
			setActiveDiffId(nextDiffId)
			scrollToDivWithId(getDiffLeafID(nextDiffId))
			suggestionGuard(() => {
				editor.tf.setValue(value)
			})
			setAcceptedDiffValue(value)
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[
			originalValue,
			element,
			editor.tf,
			nextDiffId,
			suggestionGuard,
			lastMessage,
		]
	)
	return (
		<div className="absolute top-2/5 z-50 flex translate-x-full gap-2 pl-10">
			<Button
				variant="outline"
				size="sm"
				onClick={(e) => handleStatusChange(e, DiffStatus.ACCEPTED)}
				innerClassName="h-8 bg-fm-surface-tertiary/75 backdrop-blur-md"
			>
				<Check size={16} />
				<p>Apply</p>
			</Button>
			<IconButton
				variant="outlined"
				size="small"
				tooltip="Reject SFX"
				className="bg-fm-surface-tertiary/75 border-fm-divider-contrast backdrop-blur-md"
				label="Reject SFX"
				onClick={(e) => handleStatusChange(e, DiffStatus.REJECTED)}
				icon={<X size={16} />}
			/>
		</div>
	)
}

import React, { useEffect, useMemo } from 'react'
import useAcceptChanges from '@/hooks/use-accept-changes'
import useSocketStreaming from '@/hooks/use-socket-streaming'
import usePlateStore from '@/store/plate-store'
import { useShallow } from 'zustand/react/shallow'

import { EAction, EMessenger, TMessage } from '@/types/ai-types'

import BlockContentMessage from './block-message'
import RegularMessage from './regular-message'
import SFXMessage from './sfx-message'

export default function RenderMessage({
	message,
	index,
	isLast,
}: {
	index: number
	isLast?: boolean
	message: TMessage
}) {
	const { handleAccept } = useAcceptChanges()
	const { taskEnded, responses } = useSocketStreaming()
	const { store, setActiveDiffId } = usePlateStore()
	const { diffIdList, activeDiffId } = store(
		useShallow((state) => ({
			diffIdList: state.diffIdList,
			activeDiffId: state.activeDiffId,
		}))
	)
	const sfxIndex = useMemo(
		() => diffIdList.findIndex((id) => id === activeDiffId),
		[diffIdList, activeDiffId]
	)

	useEffect(() => {
		if (sfxIndex < 0 && diffIdList.length > 0) {
			setActiveDiffId(diffIdList[0])
		}
	}, [sfxIndex, diffIdList, setActiveDiffId])

	// Route to appropriate sub-component based on message type
	if (
		message.role === EMessenger.ASSISTANT &&
		message.action === EAction.CHANGES
	) {
		return (
			<SFXMessage
				message={message}
				index={index}
				taskEnded={taskEnded}
				diffIdList={diffIdList}
				sfxIndex={sfxIndex}
				setActiveDiffId={setActiveDiffId}
				handleAccept={handleAccept}
				isLast={isLast}
			/>
		)
	}

	if (
		message.role === EMessenger.ASSISTANT &&
		message.action === EAction.BLOCK
	) {
		return (
			<BlockContentMessage
				message={message}
				taskEnded={taskEnded}
				responses={responses}
			/>
		)
	}

	return <RegularMessage message={message} taskEnded={taskEnded} />
}

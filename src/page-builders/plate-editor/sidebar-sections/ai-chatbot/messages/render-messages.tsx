import React, { useEffect } from 'react'
import useAcceptChanges from '@/hooks/use-accept-changes'
import useSocketStreaming from '@/hooks/use-socket-streaming'
import usePlateStore from '@/store/plate-store'

import { EAction, EMessenger, TMessage } from '@/types/ai-types'

import BlockContentMessage from './block-message'
import RegularMessage from './regular-message'
import SFXMessage from './sfx-message'

export default function RenderMessage({
	message,
	index,
}: {
	index: number
	message: TMessage
}) {
	const { handleAccept } = useAcceptChanges()
	const { taskEnded, responses } = useSocketStreaming()
	const { store, setActiveDiffId } = usePlateStore()
	const { diffIdList, activeDiffId } = store()
	const sfxIndex = diffIdList.findIndex((id) => id === activeDiffId)

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

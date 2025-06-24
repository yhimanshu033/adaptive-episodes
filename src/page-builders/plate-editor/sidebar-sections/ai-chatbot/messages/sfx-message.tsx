import React from 'react'

import { Divider } from '@/components/aural-ui/divider'
import { If } from '@/components/aural-ui/if-else'
import { Typography } from '@/components/aural-ui/typography'
import ChatbotStatus from '@/components/chatbot-status'

import { TAssistantMessage } from '@/types/ai-types'

import SFXControls from './sfx-controls'

const SFXMessage = ({
	message,
	index,
	taskEnded,
	diffIdList,
	sfxIndex,
	setActiveDiffId,
	handleAccept,
}: {
	diffIdList: string[]
	handleAccept: (index: number, accept: boolean, isChanges: boolean) => void
	index: number
	message: TAssistantMessage
	setActiveDiffId: (id: string) => void
	sfxIndex: number
	taskEnded: Record<string, boolean>
}) => {
	if (!taskEnded[message.taskId]) {
		return <ChatbotStatus isRunning={true} text={message.content} />
	}

	return (
		<>
			<ChatbotStatus
				isRunning={false}
				text={diffIdList.length ? `SFX Inserted` : 'No SFX Inserted'}
			/>
			<If condition={!!diffIdList.length}>
				<div className="border-fm-divider-primary/20 bg-fm-surface-secondary/30 rounded-fm-m my-2 w-full space-y-3 border p-3">
					<Typography
						variant="body-small"
						as="p"
						className="text-fm-secondary !text-fm-md"
					>
						SFX added at{' '}
						<span className="text-fm-primary">
							{diffIdList.length} breakpoints
						</span>
					</Typography>
					<Divider />
					<SFXControls
						index={index}
						handleAccept={handleAccept}
						sfxIndex={sfxIndex}
						diffIdList={diffIdList}
						setActiveDiffId={setActiveDiffId}
					/>
				</div>
			</If>
		</>
	)
}

export default SFXMessage

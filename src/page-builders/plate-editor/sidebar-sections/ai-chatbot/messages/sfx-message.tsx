import React from 'react'
import useAIChatbot from '@/hooks/use-ai-chatbot'

import { Divider } from '@/components/aural-ui/divider'
import { Typography } from '@/components/aural-ui/typography'
import ChatbotStatus from '@/components/chatbot-status'

import { TAssistantMessage } from '@/types/ai-types'

import SFXControls from './sfx-controls'

const SFXMessage = ({
	message,
	index,
	taskEnded,
	tasksTimedOut,
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
	tasksTimedOut: Set<string>
}) => {
	const { getTimeLeft, isTaskRunning } = useAIChatbot()
	const isRunning = !taskEnded[message.taskId]
	const isTimedOut = tasksTimedOut.has(message.taskId)
	const timeLeft = getTimeLeft(message.taskId)
	const isCountdownActive = isTaskRunning(message.taskId)

	if (!taskEnded[message.taskId]) {
		return (
			<ChatbotStatus
				isRunning={isRunning}
				isTimedOut={isTimedOut}
				text={message.content}
				timeLeft={timeLeft}
				isCountdownActive={isCountdownActive}
			/>
		)
	}

	if (tasksTimedOut.has(message.taskId)) {
		return (
			<ChatbotStatus
				isRunning={false}
				isTimedOut={true}
				timeLeft={0}
				isCountdownActive={false}
			/>
		)
	}

	return (
		<>
			<ChatbotStatus
				isRunning={false}
				text={diffIdList.length ? `SFX Inserted` : 'No SFX Inserted'}
			/>
			<div className="border-fm-divider-primary/20 bg-fm-surface-secondary/30 rounded-fm-m my-2 w-full space-y-3 border p-3">
				<Typography
					variant="body-small"
					as="p"
					className="text-fm-secondary !text-fm-md"
				>
					SFX pending at{' '}
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
		</>
	)
}

export default SFXMessage

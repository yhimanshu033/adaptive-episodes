import React from 'react'
import useAIChatbot from '@/hooks/use-ai-chatbot'

import ChatbotStatus from '@/components/chatbot-status'
import { cn } from '@/lib/aural-ui/utils'

import { EMessenger, TMessage } from '@/types/ai-types'

const RegularMessage = ({
	message,
	taskEnded,
	tasksTimedOut,
}: {
	message: TMessage
	taskEnded: Record<string, boolean>
	tasksTimedOut: Set<string>
}) => {
	const { getTimeLeft } = useAIChatbot()
	if (message.role === EMessenger.ASSISTANT) {
		const isRunning = !(taskEnded[message.taskId] ?? false)
		const isTimedOut = tasksTimedOut.has(message.taskId)
		const timeLeft = getTimeLeft(message.taskId)

		return (
			<>
				<ChatbotStatus
					isRunning={isRunning}
					isTimedOut={isTimedOut}
					text={message.content}
					timeLeft={timeLeft}
				/>
				{message.component}
			</>
		)
	}

	return (
		<div
			dangerouslySetInnerHTML={{
				__html: message.content.trim().replaceAll('\n', '<br/>'),
			}}
			className={cn('text-fm-md bg-fm-surface-secondary w-fit rounded-sm p-3')}
		/>
	)
}

export default RegularMessage

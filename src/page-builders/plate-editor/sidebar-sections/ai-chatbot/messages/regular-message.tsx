import React from 'react'

import ChatbotStatus from '@/components/chatbot-status'
import { cn } from '@/lib/aural-ui/utils'

import { EMessenger, TMessage } from '@/types/ai-types'

const RegularMessage = ({
	message,
	taskEnded,
}: {
	message: TMessage
	taskEnded: Record<string, boolean>
}) => {
	if (message.role === EMessenger.ASSISTANT) {
		return (
			<>
				<ChatbotStatus
					isRunning={!(taskEnded[message.taskId] ?? true)}
					text={message.content}
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

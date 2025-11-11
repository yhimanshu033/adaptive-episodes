import React, { useMemo } from 'react'
import useSocketStreaming from '@/hooks/use-socket-streaming'
import { StreamedResponseWithCopy } from '@/page-builders/plate-editor/sidebar-sections/ai-chatbot/messages/block-message'
import {
	EOutlinerChatAction,
	TOutlinerChatMessage,
} from '@/page-builders/plate-editor/sidebar-sections/outliner/lib/types'

import ChatbotStatus from '@/components/chatbot-status'
import { If } from '@/components/if-else'
import { cn } from '@/lib/aural-ui/utils'

import { EMessenger } from '@/types/ai-types'

export default function OutlinerChatMessage({
	message,
}: {
	message: TOutlinerChatMessage
}) {
	const { taskEnded, tasksTimedOut } = useSocketStreaming()
	const messageContent = useMemo(() => {
		if (!('taskId' in message)) {
			return []
		}
		const fallBackChunk = message?.content ? [message.content] : []
		return message.chunks ?? fallBackChunk
	}, [message])

	if (message.role === EMessenger.USER) {
		return (
			<div
				dangerouslySetInnerHTML={{
					__html: message.content.trim().replaceAll('\n', '<br/>'),
				}}
				className={cn(
					'text-fm-md bg-fm-surface-secondary w-fit rounded-sm p-3'
				)}
			/>
		)
	}

	const isRunning = !taskEnded[message.taskId]
	const isTimedOut = tasksTimedOut.has(message.taskId)

	return (
		<div>
			<ChatbotStatus isRunning={isRunning} isTimedOut={isTimedOut} />
			<If condition={message.outlinerAction === EOutlinerChatAction.HIGHLIGHT}>
				<p className="bg-fm-hotpink-200/30 mt-2 w-fit rounded px-2 py-1 text-sm">
					Action: Generate Selection
				</p>
			</If>
			<StreamedResponseWithCopy
				responses={messageContent}
				taskId={message.taskId}
				taskEnded={taskEnded[message.taskId]}
			/>
		</div>
	)
}

import React from 'react'
import useAIChatbot from '@/hooks/use-ai-chatbot'
import { CopyIcon } from '@/icons/copy-icon'

import { IconButton } from '@/components/aural-ui/icon-button'
import { If } from '@/components/aural-ui/if-else'
import ChatbotStatus from '@/components/chatbot-status'
import { StoryAccordion } from '@/components/render-content'
import StreamedResponse from '@/components/ui/streamed-response'
import {
	extract,
	handleToolTags,
	hasToolResult,
	parseOptimistically,
} from '@/lib/utils/helpers'

import { PlotExplorerApiResponse, TAssistantMessage } from '@/types/ai-types'

export const StreamedResponseWithCopy = ({
	responses,
	taskEnded,
}: {
	responses: string[]
	taskEnded: boolean
	taskId: string
}) => {
	const handleCopy = () => {
		void navigator.clipboard.writeText(extract(responses.join('')))
	}

	return (
		<div className="relative flex">
			<StreamedResponse
				onClick={handleCopy}
				data={responses}
				dataConversion={(str) => handleToolTags(str, true)}
				className="text-fm-md w-auto flex-1 rounded-sm bg-transparent py-2 transition-transform active:scale-[0.995]"
			/>
			<If condition={taskEnded && !!extract(responses.join('')).trim().length}>
				<IconButton
					tooltip="Copy"
					label="copy"
					onClick={handleCopy}
					variant="ghost"
					className="sticky top-1 m-1 size-6 p-1! transition-all hover:scale-105 active:scale-75"
					icon={<CopyIcon className="h-8 w-8" />}
				/>
			</If>
		</div>
	)
}

const BlockContentMessage = ({
	message,
	taskEnded,
	responses,
	tasksTimedOut,
}: {
	message: TAssistantMessage
	responses: Record<string, string[]>
	taskEnded: Record<string, boolean>
	tasksTimedOut: Set<string>
}) => {
	const { getTimeLeft, isTaskRunning } = useAIChatbot()
	const messageResponses = responses[message.taskId] || []
	if (messageResponses.length > 0) {
		messageResponses[0] = messageResponses[0].trimStart()
	}

	const isRunning = !taskEnded[message.taskId]
	const isTimedOut = tasksTimedOut.has(message.taskId)
	const timeLeft = getTimeLeft(message.taskId)
	const isCountdownActive = isTaskRunning(message.taskId)

	if (!messageResponses.length) {
		return (
			<ChatbotStatus
				isTimedOut={isTimedOut}
				timeLeft={timeLeft}
				isCountdownActive={isCountdownActive}
			/>
		)
	}

	return (
		<>
			<ChatbotStatus
				isRunning={isRunning}
				isTimedOut={isTimedOut}
				timeLeft={timeLeft}
				isCountdownActive={isCountdownActive}
			/>
			{!hasToolResult(messageResponses) ? (
				<StreamedResponseWithCopy
					responses={messageResponses}
					taskId={message.taskId}
					taskEnded={taskEnded[message.taskId]}
				/>
			) : (
				<StoryAccordion
					className="*:animate-in w-auto flex-1 rounded-sm p-3 transition-transform active:scale-[0.995]"
					explorerData={
						parseOptimistically<PlotExplorerApiResponse['data']>(
							handleToolTags(messageResponses)
						) ?? ''
					}
				/>
			)}
		</>
	)
}

export default BlockContentMessage

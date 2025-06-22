import React from 'react'
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

const StreamedResponseWithCopy = ({
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
}: {
	message: TAssistantMessage
	responses: Record<string, string[]>
	taskEnded: Record<string, boolean>
}) => {
	const messageResponses = responses[message.taskId] || []

	if (!messageResponses.length) {
		return <ChatbotStatus isRunning={true} />
	}

	return (
		<>
			<ChatbotStatus isRunning={!taskEnded[message.taskId]} />
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

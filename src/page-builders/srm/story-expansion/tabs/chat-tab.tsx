'use client'

import React from 'react'

import { Button } from '@/components/aural-ui/button'
import { Divider } from '@/components/aural-ui/divider'

import useStoryExpansion from '../provider'
import ChatTabUI from './chat-tab-ui'

export default function ChatTab() {
	const {
		chatMessages,
		chatInput,
		setChatInput,
		conversationSummary,
		handleSendChatMessage,
		handleSaveConversationSummary,
		handleFinalizePlanFromChat,
		isSavingConversationSummary,
		isFinalizingFromChat,
		isSendingChatMessage,
	} = useStoryExpansion()

	return (
		<div className="grid h-full grid-cols-[1fr_1fr] gap-4 overflow-hidden">
			{/* Left: Conversation Summary */}
			<div className="border-fm-divider-primary flex flex-col border-r p-6">
				<div className="flex-1 space-y-4">
					<h3 className="text-fm-2xl font-fm-brand text-fm-primary">
						Conversation Summary
					</h3>
					<Divider />
					<div className="">
						{conversationSummary ? (
							<p className="text-fm-md text-fm-secondary whitespace-pre-wrap">
								{conversationSummary.content}
							</p>
						) : (
							<p className="text-fm-md text-fm-tertiary">
								{
									"No summary available. Click 'Save' to generate a summary fromthe conversation."
								}
							</p>
						)}
					</div>
				</div>
				<div className="flex justify-end gap-2">
					<Button
						onClick={handleSaveConversationSummary}
						isDisabled={
							isSavingConversationSummary || chatMessages.length === 0
						}
						variant="secondary"
						size="sm"
					>
						{isSavingConversationSummary ? 'Saving...' : 'Save'}
					</Button>
					<Button
						onClick={handleFinalizePlanFromChat}
						isDisabled={isFinalizingFromChat || !conversationSummary}
						variant="primary"
						size="sm"
					>
						{isFinalizingFromChat ? 'Finalizing...' : 'Finalise Rewrite Plan'}
					</Button>
				</div>
			</div>

			{/* Right: Chat */}
			<ChatTabUI
				messages={chatMessages}
				input={chatInput}
				setInput={setChatInput}
				handleSendMessage={handleSendChatMessage}
				isSendingMessage={isSendingChatMessage}
				emptyStateMessage="Start a conversation with AI"
			/>
		</div>
	)
}

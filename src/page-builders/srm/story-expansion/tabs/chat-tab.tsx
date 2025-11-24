'use client'

import React, { useEffect, useRef } from 'react'
import ArrowRightIcon from '@/icons/arrow-right-icon'

import { Button } from '@/components/aural-ui/button'
import { Divider } from '@/components/aural-ui/divider'
import { IconButton } from '@/components/aural-ui/icon-button'
import { ScrollArea } from '@/components/aural-ui/scroll-area'
import TextArea from '@/components/aural-ui/textarea'
import { cn } from '@/lib/aural-ui/utils'

import useStoryExpansion from '../provider'

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

	const messagesEndRef = useRef<HTMLDivElement>(null)
	const textareaRef = useRef<HTMLTextAreaElement>(null)

	useEffect(() => {
		if (messagesEndRef.current) {
			messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
		}
	}, [chatMessages])

	const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault()
			handleSendChatMessage()
		}
	}

	const hasText = chatInput.trim().length > 0

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
			<div className="grid h-full grid-rows-[1fr_auto_auto] overflow-hidden">
				<ScrollArea className="h-full overflow-auto px-4">
					<div className="flex flex-col gap-4 py-4">
						{chatMessages.length === 0 ? (
							<div className="text-fm-tertiary py-8 text-center">
								<p className="text-fm-md">Start a conversation with AI</p>
							</div>
						) : (
							chatMessages.map((message) => (
								<div
									key={message.id}
									className={cn(
										'flex',
										message.role === 'user' ? 'justify-end' : 'justify-start'
									)}
								>
									<div
										className={cn(
											'max-w-[80%] rounded-lg p-3',
											message.role === 'user'
												? 'bg-fm-primary text-fm-surface-secondary'
												: 'bg-fm-surface-secondary text-fm-primary'
										)}
									>
										<p className="text-fm-md whitespace-pre-wrap">
											{message.content}
										</p>
									</div>
								</div>
							))
						)}
						{isSendingChatMessage && (
							<div className="flex justify-start">
								<div className="bg-fm-surface-secondary text-fm-primary rounded-lg p-3">
									<p className="text-fm-md">AI is thinking...</p>
								</div>
							</div>
						)}
						<div ref={messagesEndRef} />
					</div>
				</ScrollArea>

				<Divider className="mx-4" />
				<div className="space-y-4 p-4">
					<div className="flex gap-2">
						<TextArea
							ref={textareaRef}
							value={chatInput}
							onChange={(e) => setChatInput(e.target.value)}
							onKeyDown={handleKeyDown}
							placeholder="Type your message..."
							decoration="outline"
							autoGrow
							minHeight={40}
							maxHeight={120}
							className="flex-1"
						/>
						<IconButton
							onClick={handleSendChatMessage}
							disabled={!hasText || isSendingChatMessage}
							variant="outlined"
							icon={<ArrowRightIcon width={16} height={16} />}
							label="Send"
						/>
					</div>
				</div>
			</div>
		</div>
	)
}

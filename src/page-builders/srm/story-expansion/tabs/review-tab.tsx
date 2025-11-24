'use client'

import React, { useEffect, useRef } from 'react'
import ArrowRightIcon from '@/icons/arrow-right-icon'

import { Button } from '@/components/aural-ui/button'
import { Divider } from '@/components/aural-ui/divider'
import { IconButton } from '@/components/aural-ui/icon-button'
import { ScrollArea } from '@/components/aural-ui/scroll-area'
import TextArea from '@/components/aural-ui/textarea'
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion'
import { cn } from '@/lib/aural-ui/utils'

import EditableText from '../components/editable-text'
import useStoryExpansion from '../provider'

export default function ReviewTab() {
	const {
		plan,
		reviewChatMessages,
		reviewChatInput,
		setReviewChatInput,
		handleSendReviewChatMessage,
		handleGenerateEpisodes,
		updateArcName,
		updateEpisodeName,
		updateEpisodeSummary,
		isSendingReviewMessage,
		isGeneratingEpisodes,
	} = useStoryExpansion()

	const messagesEndRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		if (messagesEndRef.current) {
			messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
		}
	}, [reviewChatMessages])

	const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault()
			handleSendReviewChatMessage()
		}
	}

	const hasText = reviewChatInput.trim().length > 0

	if (!plan) {
		return (
			<div className="flex h-full items-center justify-center">
				<p className="text-fm-md text-fm-tertiary">No plan available</p>
			</div>
		)
	}

	return (
		<div className="grid h-full grid-cols-[1fr_1fr] overflow-hidden">
			{/* Left: Generated Plan */}
			<div className="border-fm-divider-primary flex flex-col gap-4 overflow-hidden border-r px-6 pt-6 pb-2">
				<h3 className="text-fm-2xl font-fm-brand text-fm-primary">
					Generated Plan
				</h3>
				<Divider />
				<ScrollArea className="h-full flex-1 [--color-border:var(--color-fm-divider-primary)]">
					<Accordion collapsible type="single">
						{plan.arcs.map((arc) => (
							<AccordionItem value={arc.id} key={arc.id}>
								<AccordionTrigger>
									<EditableText
										value={arc.name}
										onChange={(value) => updateArcName(arc.id, value)}
										className="font-fm-text text-fm-primary"
									/>
								</AccordionTrigger>
								<AccordionContent>
									<Accordion collapsible type="single" className="pl-4">
										{arc.episodes.map((episode) => (
											<AccordionItem value={episode.id} key={episode.id}>
												<AccordionTrigger>
													<EditableText
														value={episode.name}
														onChange={(value) =>
															updateEpisodeName(arc.id, episode.id, value)
														}
														className="font-fm-text text-fm-secondary"
													/>
												</AccordionTrigger>
												<AccordionContent>
													<div className="mt-2 pl-4">
														<EditableText
															value={episode.summary}
															onChange={(value) =>
																updateEpisodeSummary(arc.id, episode.id, value)
															}
															multiline
															className="text-fm-xs text-fm-tertiary"
															placeholder="Episode summary..."
														/>
													</div>
												</AccordionContent>
											</AccordionItem>
										))}
									</Accordion>
								</AccordionContent>
							</AccordionItem>
						))}
					</Accordion>
				</ScrollArea>
				<div className="flex justify-end">
					<Button
						onClick={handleGenerateEpisodes}
						isDisabled={isGeneratingEpisodes}
						variant="primary"
						size="md"
					>
						{isGeneratingEpisodes ? 'Generating...' : 'Generate Episodes'}
					</Button>
				</div>
			</div>

			{/* Right: Chat Bot */}
			<div className="grid h-full grid-rows-[1fr_auto_auto] overflow-hidden">
				<ScrollArea className="h-full overflow-auto px-4">
					<div className="flex flex-col gap-4 py-4">
						{reviewChatMessages.length === 0 ? (
							<div className="text-fm-tertiary py-8 text-center">
								<p className="text-fm-md">
									Start a conversation about the plan
								</p>
							</div>
						) : (
							reviewChatMessages.map((message) => (
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
						{isSendingReviewMessage && (
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
							value={reviewChatInput}
							onChange={(e) => setReviewChatInput(e.target.value)}
							onKeyDown={handleKeyDown}
							placeholder="Type your message..."
							decoration="outline"
							autoGrow
							minHeight={40}
							maxHeight={120}
							className="flex-1"
						/>
						<IconButton
							onClick={handleSendReviewChatMessage}
							disabled={!hasText || isSendingReviewMessage}
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

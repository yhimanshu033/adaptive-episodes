'use client'

import React from 'react'

import { Button } from '@/components/aural-ui/button'
import { Divider } from '@/components/aural-ui/divider'
import { ScrollArea } from '@/components/aural-ui/scroll-area'
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion'

import EditableText from '../components/editable-text'
import useStoryExpansion from '../provider'
import ChatTabUI from './chat-tab-ui'

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

	if (!plan) {
		return (
			<div className="flex h-full items-center justify-center">
				<p className="text-fm-md text-fm-tertiary">No plan available</p>
			</div>
		)
	}

	const totalEpisodes = plan.arcs.reduce(
		(sum, arc) => sum + arc.episodes.length,
		0
	)

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

			{/* Right: Summary and Chat */}
			<div className="flex flex-col overflow-hidden">
				{/* Above: Summary of what's being done */}
				<div className="border-fm-divider-primary flex flex-col border-b p-6">
					<h3 className="text-fm-2xl font-fm-brand text-fm-primary mb-4">
						Summary
					</h3>
					<Divider />
					<div className="mt-4 space-y-2">
						<p className="text-fm-md text-fm-secondary">
							<span className="font-medium">Plan Overview:</span> This rewrite
							plan consists of{' '}
							<span className="font-medium">{plan.arcs.length}</span> narrative
							arc{plan.arcs.length !== 1 ? 's' : ''} with a total of{' '}
							<span className="font-medium">{totalEpisodes}</span> episode
							{totalEpisodes !== 1 ? 's' : ''}.
						</p>
						<div className="mt-4 space-y-1">
							<p className="text-fm-sm text-fm-primary font-medium">
								Arc Breakdown:
							</p>
							{plan.arcs.map((arc, index) => (
								<p key={arc.id} className="text-fm-sm text-fm-secondary pl-4">
									{index + 1}. {arc.name} ({arc.episodes.length} episode
									{arc.episodes.length !== 1 ? 's' : ''})
								</p>
							))}
						</div>
					</div>
				</div>

				{/* Below: SRM Chat */}
				<div className="flex-1 overflow-hidden">
					<ChatTabUI
						messages={reviewChatMessages}
						input={reviewChatInput}
						setInput={setReviewChatInput}
						handleSendMessage={handleSendReviewChatMessage}
						isSendingMessage={isSendingReviewMessage}
						emptyStateMessage="Start a conversation about the plan"
					/>
				</div>
			</div>
		</div>
	)
}

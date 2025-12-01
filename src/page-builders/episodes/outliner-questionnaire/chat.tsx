'use client'

import React, { useEffect, useRef } from 'react'
import { AiAvatarIcon } from '@/icons/ai-avatar-icon'
import OutlinerQuestionnaireChatMessage from '@/page-builders/episodes/outliner-questionnaire/chat-message'
import OutlinerQuestionnairePromptInput from '@/page-builders/episodes/outliner-questionnaire/chat-prompt'
import { EOutlinerQuestionnaireTab } from '@/page-builders/episodes/outliner-questionnaire/lib/types'
import useOutlinerQuestionnaire from '@/page-builders/episodes/outliner-questionnaire/provider'

import { If } from '@/components/aural-ui/if-else'
import { Typography } from '@/components/aural-ui/typography'
import ChatbotStatus from '@/components/chatbot-status'
import { CircularProgressBar } from '@/components/ui/circular-progress'
import { cn } from '@/lib/aural-ui/utils'

export default function OutlinerQuestionnaireChat() {
	const {
		messages,
		isChatLoading,
		chatCompleteRatio,
		chatComplete,
		lastMessageTaskId,
	} = useOutlinerQuestionnaire()
	const messagesEndRef = useRef<HTMLDivElement>(null)

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
	}

	useEffect(() => {
		scrollToBottom()
	}, [messages, isChatLoading])

	return (
		<div className="relative grid h-full grid-rows-[auto_1fr_auto] overflow-clip [--text-fm-md:1.125rem]">
			<div
				className={cn(
					'sticky top-24 flex items-center justify-end gap-4 px-4 transition-opacity',
					{ 'opacity-0': !chatCompleteRatio }
				)}
			>
				<p className="text-xs">Completion:</p>
				<CircularProgressBar
					className="size-6"
					gaugePrimaryColor="var(--color-fm-hotpink-500)"
					gaugeSecondaryColor="var(--color-fm-neutral-200)"
					value={chatCompleteRatio}
					min={0}
					max={1}
				/>
			</div>
			<div className="flex h-[calc(100dvh-320px)] flex-col justify-end-safe space-y-4 overflow-auto px-4 pt-4">
				{messages.map((msg, idx) => (
					<OutlinerQuestionnaireChatMessage
						message={msg}
						key={`outliner-questionnaire-message-${idx}`}
						isLast={idx === messages.length - 1}
					/>
				))}
				<If condition={isChatLoading || !!lastMessageTaskId}>
					<ChatbotStatus isRunning />
				</If>
				<If condition={chatComplete}>
					<RedirectToProfile />
				</If>
				<div ref={messagesEndRef} />
			</div>
			<OutlinerQuestionnairePromptInput />
		</div>
	)
}

function RedirectToProfile() {
	const { handleChangeTab } = useOutlinerQuestionnaire()

	useEffect(() => {
		const timer = setTimeout(() => {
			handleChangeTab(EOutlinerQuestionnaireTab.WRITER_PROFILE)
		}, 2000)

		return () => clearTimeout(timer)
	}, [handleChangeTab])

	return (
		<div className="flex items-center gap-3">
			<AiAvatarIcon className="h-6 w-6" />
			<Typography className="text-fm-md! animate-gradient-slide bg-clip-text text-transparent">
				Creating Your Writer Profile...
			</Typography>
		</div>
	)
}

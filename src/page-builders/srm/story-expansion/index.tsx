'use client'

import React from 'react'

import { EStoryExpansionTab } from './lib/types'
import useStoryExpansion, { StoryExpansionContextProvider } from './provider'
import ChatTab from './tabs/chat-tab'
import ParametersTab from './tabs/parameters-tab'
import ProgressTab from './tabs/progress-tab'
import RangeTab from './tabs/range-tab'
import ReviewTab from './tabs/review-tab'
import StartTab from './tabs/start-tab'

function StoryExpansionContent() {
	const { storyExpansionTab } = useStoryExpansion()

	const tabComponents: Record<EStoryExpansionTab, React.ReactNode> = {
		[EStoryExpansionTab.RANGE]: <RangeTab />,
		[EStoryExpansionTab.START]: <StartTab />,
		[EStoryExpansionTab.CHAT]: <ChatTab />,
		[EStoryExpansionTab.PARAMETERS]: <ParametersTab />,
		[EStoryExpansionTab.REVIEW]: <ReviewTab />,
		[EStoryExpansionTab.PROGRESS]: <ProgressTab />,
	}

	return (
		<div className="container mx-auto grid h-[calc(100dvh-100px)] w-full">
			{tabComponents[storyExpansionTab]}
		</div>
	)
}

export default function StoryExpansion() {
	return (
		<StoryExpansionContextProvider>
			<StoryExpansionContent />
		</StoryExpansionContextProvider>
	)
}

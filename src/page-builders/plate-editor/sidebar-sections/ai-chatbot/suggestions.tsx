import React from 'react'
import { storyChatSuggestions } from '@/constants/editor-constants'
import useAIChatbot from '@/hooks/use-ai-chatbot'

import { Button } from '@/components/ui/button'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'

import { EChatMode } from '@/types/ai-types'

import { PromptsPopover } from './prompts-popover'

export default function Suggestions() {
	const { disabled, isPending, handleSuggestion, changesPending } =
		useAIChatbot()
	return (
		<ScrollArea className="flex-[0_0_auto] overflow-x-auto pb-2 *:*:flex">
			<ScrollBar orientation="horizontal" />
			{storyChatSuggestions.map((suggestion, index) =>
				suggestion.action === EChatMode.PROMPTS ? (
					<PromptsPopover key={index}>
						<Button
							variant="outline"
							size="sm"
							className="mb-1 mr-2"
							disabled={!!changesPending || disabled || isPending}
						>
							{suggestion.value}
						</Button>
					</PromptsPopover>
				) : (
					<Button
						key={index}
						variant="outline"
						size="sm"
						onClick={() => {
							handleSuggestion(suggestion)
						}}
						className="mb-1 mr-2"
						disabled={
							!!changesPending ||
							disabled ||
							isPending ||
							suggestion.action === EChatMode.VOICE
						}
					>
						{suggestion.value}
					</Button>
				)
			)}
		</ScrollArea>
	)
}

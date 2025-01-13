import React from 'react'
import { quickPrompts } from '@/constants/ai-constants'
import useAIChatbot from '@/hooks/use-ai-chatbot'

import { Button } from '@/components/ui/button'
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover'
import { trim } from '@/lib/utils'

import { EChatMode } from '@/types/ai-types'

export function PromptsPopover({ children }: { children: React.ReactNode }) {
	const { handleSuggestion } = useAIChatbot()
	return (
		<Popover>
			<PopoverTrigger asChild>{children}</PopoverTrigger>
			<PopoverContent className="w-[700px]">
				<div className="flex flex-col gap-2">
					{quickPrompts.map((suggestion, idx) => (
						<Button
							onClick={() =>
								handleSuggestion({
									action: EChatMode.PROMPTS,
									value: suggestion,
								})
							}
							variant="outline"
							className="overflow-hidden"
							key={idx}
						>
							{trim(suggestion, 80)}
						</Button>
					))}
				</div>
			</PopoverContent>
		</Popover>
	)
}

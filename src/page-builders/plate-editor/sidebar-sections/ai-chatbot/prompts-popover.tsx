import React from 'react'
import { QUICK_PROMPTS } from '@/constants/ai-constants'
import useAIChatbot from '@/hooks/use-ai-chatbot'

import { Button } from '@/components/ui/button'
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover'
import { trim } from '@/lib/utils/helpers'

import { EChatMode } from '@/types/ai-types'

export function PromptsPopover({ children }: { children: React.ReactNode }) {
	const { handleSuggestion } = useAIChatbot()
	return (
		<Popover>
			<PopoverTrigger asChild>{children}</PopoverTrigger>
			<PopoverContent className="w-[400px]">
				<div className="flex flex-col gap-2">
					{QUICK_PROMPTS.map(({ title, text }, idx) => (
						<Button
							onClick={() =>
								handleSuggestion({
									action: EChatMode.PROMPTS,
									value: text,
								})
							}
							variant="outline"
							className="overflow-hidden"
							key={idx}
						>
							{trim(title ?? text, 50)}
						</Button>
					))}
				</div>
			</PopoverContent>
		</Popover>
	)
}

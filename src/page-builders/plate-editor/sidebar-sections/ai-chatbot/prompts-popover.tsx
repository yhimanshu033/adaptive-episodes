import React, { useMemo } from 'react'
import { QUICK_PROMPTS, QUICK_PROMPTS_EN } from '@/constants/ai-constants'
import useAIChatbot from '@/hooks/use-ai-chatbot'
import useIsGerman from '@/hooks/use-is-german'

import { Button } from '@/components/ui/button'
import ForEach from '@/components/ui/for-each'
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover'
import { trim } from '@/lib/utils/helpers'

import { EChatMode } from '@/types/ai-types'

export function PromptsPopover({ children }: { children: React.ReactNode }) {
	const { handleSuggestion } = useAIChatbot()
	const isGerman = useIsGerman()

	const prompts = useMemo(() => {
		if (!isGerman) {
			return QUICK_PROMPTS_EN
		}
		return QUICK_PROMPTS
	}, [isGerman])
	return (
		<Popover>
			<PopoverTrigger asChild>{children}</PopoverTrigger>
			<PopoverContent className="w-[400px]">
				<div className="flex flex-col gap-2">
					<ForEach data={prompts}>
						{({ title, text }, idx) => (
							<Button
								tooltip="Quick Prompts"
								key={`quick-prompt-${idx}`}
								onClick={() =>
									handleSuggestion({
										action: EChatMode.PROMPTS,
										value: text,
									})
								}
								variant="outline"
								className="overflow-hidden"
							>
								{trim(title ?? text, 50)}
							</Button>
						)}
					</ForEach>
				</div>
			</PopoverContent>
		</Popover>
	)
}

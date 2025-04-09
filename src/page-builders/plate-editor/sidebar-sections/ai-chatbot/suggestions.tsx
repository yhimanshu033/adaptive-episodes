import React from 'react'
import { storyChatSuggestions } from '@/constants/editor-constants'
import useAIChatbot from '@/hooks/use-ai-chatbot'
import { PromptsPopover } from '@/page-builders/plate-editor/sidebar-sections/ai-chatbot/prompts-popover'
import { useEditorReadOnly } from '@udecode/plate-common/react'

import IfElse, { Else, If } from '@/components/if-else'
import { Button } from '@/components/ui/button'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { isEditingAction } from '@/lib/utils/ai-chatbot'

import { EChatMode } from '@/types/ai-types'

export default function Suggestions() {
	const { disabled, isPending, handleSuggestion, changesPending } =
		useAIChatbot()
	const readOnly = useEditorReadOnly()
	return (
		<ScrollArea className="flex-[0_0_auto] overflow-x-auto pb-2 *:*:flex">
			<ScrollBar orientation="horizontal" />
			{storyChatSuggestions.map((suggestion, index) => (
				<IfElse key={index} condition={suggestion.action === EChatMode.PROMPTS}>
					<If>
						<PromptsPopover>
							<Button
								variant="outline"
								size="sm"
								className="mb-1 mr-2"
								disabled={!!changesPending || disabled || isPending}
							>
								{suggestion.value}
							</Button>
						</PromptsPopover>
					</If>
					<Else>
						<If condition={!readOnly || !isEditingAction(suggestion.action)}>
							<Button
								variant="outline"
								size="sm"
								onClick={() => {
									handleSuggestion(suggestion)
								}}
								className="mb-1 mr-2"
								disabled={!!changesPending || disabled || isPending}
							>
								{suggestion.value}
							</Button>
						</If>
					</Else>
				</IfElse>
			))}
		</ScrollArea>
	)
}

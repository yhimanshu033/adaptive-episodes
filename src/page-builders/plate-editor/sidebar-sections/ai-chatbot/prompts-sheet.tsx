import React, { useMemo } from 'react'
import { QUICK_PROMPTS, QUICK_PROMPTS_EN } from '@/constants/ai-constants'
import useAIChatbot from '@/hooks/use-ai-chatbot'
import useIsGerman from '@/hooks/use-is-german'

import { List, ListItem, ListSeparator } from '@/components/aural-ui/list'
import { Sheet, SheetContent, SheetTitle } from '@/components/aural-ui/sheet'
import ForEach from '@/components/ui/for-each'
import { trim } from '@/lib/utils/helpers'

import { EChatMode } from '@/types/ai-types'
import { TSuggestions } from '@/types/editor-types'

import ChatClearAlert from './alert'

const PromptsSheet = ({
	open,
	setOpen,
	containerRef,
	suggestions = [],
}: {
	containerRef?: React.RefObject<HTMLElement>
	open: boolean
	setOpen: React.Dispatch<React.SetStateAction<boolean>>
	suggestions?: TSuggestions[]
}) => {
	const { handleSuggestion } = useAIChatbot()
	const isGerman = useIsGerman()

	const prompts = useMemo(() => {
		if (!isGerman) {
			return QUICK_PROMPTS_EN
		}
		return QUICK_PROMPTS
	}, [isGerman])

	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetTitle />
			<SheetContent
				container={containerRef?.current}
				className="bg-fm-surface-frosted/5 p-0"
				classes={{
					overlay: 'absolute inset-x-0 bg-none',
					content: 'absolute inset-x-0 h-auto w-full',
				}}
			>
				<List
					showBorder={false}
					className="w-full bg-transparent px-2 pt-2 pb-4"
				>
					<ForEach data={suggestions}>
						{({ action, value }, idx) => (
							<React.Fragment key={`suggestion-${idx}`}>
								<ListItem
									size="sm"
									onClick={() => {
										setOpen(false)
										handleSuggestion({
											action,
											value,
										})
									}}
									className="flex justify-start gap-2 px-2"
								>
									{value}
								</ListItem>
								<ListSeparator />
							</React.Fragment>
						)}
					</ForEach>
					<ForEach data={prompts}>
						{({ title, text }, idx) => (
							<React.Fragment key={`quick-prompt-${idx}`}>
								<ListItem
									size="sm"
									onClick={() => {
										setOpen(false)
										handleSuggestion({
											action: EChatMode.PROMPTS,
											value: text,
										})
									}}
									className="px-2"
								>
									{trim(title ?? text, 50)}
								</ListItem>
								<ListSeparator />
							</React.Fragment>
						)}
					</ForEach>
					<ListItem size="sm" className="px-2">
						<ChatClearAlert onTrigger={() => setOpen(false)}>
							<p className="text-fm-negative">Delete all chat</p>
						</ChatClearAlert>
					</ListItem>
				</List>
			</SheetContent>
		</Sheet>
	)
}

export default PromptsSheet

import React, { useRef, useState } from 'react'
import { storyChatSuggestions } from '@/constants/editor-constants'
import useAIChatbot from '@/hooks/use-ai-chatbot'
import ChevronUpIcon from '@/icons/chevron-up-icon'
import useAIStore from '@/store/ai-store'
import { usePlateState } from 'platejs/react'

import { Button } from '@/components/aural-ui/button'
import { Divider } from '@/components/aural-ui/divider'
import { Else, If, IfElse } from '@/components/aural-ui/if-else'
import { List, ListItem } from '@/components/aural-ui/list'
import { cn } from '@/lib/aural-ui/utils'

import { EChatMode } from '@/types/ai-types'
import { TSuggestions } from '@/types/editor-types'

import PromptsSheet from './prompts-sheet'

const SuggestionButton = ({
	suggestion,
	index,
	onSuggestionClick,
	disabled,
}: {
	disabled: boolean
	index: number
	onSuggestionClick: (suggestion: TSuggestions) => void
	suggestion: TSuggestions
}) => {
	const { value, icon: Icon } = suggestion

	return (
		<Button
			key={index}
			size="sm"
			variant="outline"
			onClick={() => onSuggestionClick(suggestion)}
			disabled={disabled}
			className={cn('min-w-0 gap-2 py-2', {
				'text-fm-tertiary cursor-not-allowed': disabled,
			})}
			innerClassName="font-fm-text w-fit border-fm-divider-primary"
		>
			<Icon className="h-4 w-4 flex-shrink-0" />
			{value}
		</Button>
	)
}

const LAYOUT_CONFIGS = [
	{
		className: 'flex w-full justify-start gap-2 @[455px]:hidden',
		maxItems: 2,
		showMore: true,
		keyPrefix: 'sm',
	},
	{
		className: 'hidden w-full gap-2 @[455px]:flex @[540px]:hidden',
		maxItems: 3,
		showMore: true,
		keyPrefix: 'md',
	},
	{
		className: 'hidden w-full gap-2 @[540px]:flex',
		maxItems: storyChatSuggestions.length,
		showMore: false,
		keyPrefix: 'lg',
	},
]

export default function Suggestions() {
	const [sheetOpen, setSheetOpen] = useState<boolean>(false)
	const [additionalSuggestions, setAdditionalSuggestions] = useState<
		TSuggestions[]
	>([])

	const [readOnly] = usePlateState('readOnly')

	const { disabled, isPending, handleSuggestion, changesPending } =
		useAIChatbot()
	const { store } = useAIStore()
	const { messages } = store()

	const containerRef = useRef<HTMLDivElement>(null)

	const moreSuggestion: TSuggestions = {
		action: EChatMode.PROMPTS,
		value: '',
		icon: ChevronUpIcon,
	}

	const handleSuggestionClick = (suggestion: TSuggestions) => {
		if (suggestion.action === EChatMode.PROMPTS) {
			if (suggestion?.addSuggestion) {
				// Add Voice Pass (3rd item) to additional suggestions
				setAdditionalSuggestions([storyChatSuggestions[2]])
			} else {
				setAdditionalSuggestions([])
			}
			setSheetOpen(true)
			return
		}
		handleSuggestion({ value: suggestion.value, action: suggestion.action })
	}

	const isDisabled = !!changesPending || disabled || isPending

	const isExclusiveMode = (action: EChatMode) => {
		return readOnly && [EChatMode.SFX, EChatMode.REVIEW].includes(action)
	}

	const renderButtonLayout = () => (
		<div>
			{LAYOUT_CONFIGS.map((config, layoutIndex) => (
				<div key={layoutIndex} className={config.className}>
					{/* Regular suggestions */}
					{storyChatSuggestions
						.slice(0, config.maxItems)
						.map((suggestion, index) => (
							<SuggestionButton
								key={`${config.keyPrefix}-${index}`}
								suggestion={suggestion}
								index={index}
								onSuggestionClick={handleSuggestionClick}
								disabled={isDisabled || !!isExclusiveMode(suggestion.action)}
							/>
						))}

					{/* More button if needed */}
					{config.showMore && (
						<SuggestionButton
							key={`${config.keyPrefix}-more`}
							suggestion={{
								...moreSuggestion,
								addSuggestion: config.maxItems < 3,
							}}
							index={config.maxItems}
							onSuggestionClick={handleSuggestionClick}
							disabled={isDisabled || !!isExclusiveMode(moreSuggestion.action)}
						/>
					)}
				</div>
			))}
		</div>
	)

	const renderListLayout = () => (
		<List showBorder={false} className="w-full bg-inherit">
			{storyChatSuggestions.map(({ action, value, icon: Icon }, index) => (
				<React.Fragment key={index}>
					<ListItem
						size="sm"
						onClick={() => handleSuggestionClick({ action, value, icon: Icon })}
						disabled={isDisabled || !!isExclusiveMode(action)}
						className="text-fm-tertiary hover:text-fm-primary data-[disabled=true]:text-fm-inactive/50 flex cursor-pointer items-center gap-2 bg-transparent! py-3 hover:bg-inherit"
					>
						<Icon className="mr-2 size-4 text-inherit" />
						<p>{value}</p>
					</ListItem>
					{index !== storyChatSuggestions.length - 1 && (
						<Divider className="opacity-60" variant="secondary" />
					)}
				</React.Fragment>
			))}
		</List>
	)

	return (
		<div ref={containerRef} className="@container mb-2">
			<IfElse condition={!!messages.length}>
				<If>{renderButtonLayout()}</If>
				<Else>{renderListLayout()}</Else>
			</IfElse>

			<PromptsSheet
				containerRef={containerRef}
				open={sheetOpen}
				setOpen={setSheetOpen}
				suggestions={additionalSuggestions}
			/>
		</div>
	)
}

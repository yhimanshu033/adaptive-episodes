import React, { useCallback } from 'react'
import ArrowRightIcon from '@/icons/arrow-right-icon'
import { EOutlinerChatMode } from '@/page-builders/plate-editor/sidebar-sections/outliner/lib/types'
import useOutliner from '@/page-builders/plate-editor/sidebar-sections/outliner/provider'

import { IconButton } from '@/components/aural-ui/icon-button'
import TextArea, { textareaVariants } from '@/components/aural-ui/textarea'
import { cn } from '@/lib/aural-ui/utils'

export const OUTLINER_CHAT_PLACEHOLDERS: Record<EOutlinerChatMode, string> = {
	[EOutlinerChatMode.CHAT]:
		'Ask anything about your story, characters, or next steps',
	[EOutlinerChatMode.GENERATE_SELECTION]:
		"Describe how you'd like this section to be rewritten",
	[EOutlinerChatMode.GENERATE_CONTENT]:
		"Describe what you'd like to happen next in your story",
	[EOutlinerChatMode.EXPAND_OUTLINE]:
		"Describe how you'd like to expand this idea into scenes",
}

export default function OutlinerPromptInput() {
	const {
		prompt,
		setPrompt,
		addMessage,
		isOutlinerChatPending,
		outlinerChatMode,
	} = useOutliner()
	const handleSendMessage = useCallback(() => {
		if (!prompt.trim().length) {
			return
		}
		setPrompt('')
		void addMessage({ prompt })
	}, [addMessage, prompt, setPrompt])

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter' && !e.shiftKey && !disabled && hasText) {
			e.preventDefault()
			handleSendMessage()
		}
	}

	const disabled = isOutlinerChatPending
	const hasText = !!prompt.trim().length

	return (
		<div>
			<div
				className={cn(
					textareaVariants({
						variant: 'default',
					}),
					'focus:border-fm-divider-contrast w-auto rounded-md border-transparent transition-all duration-200'
				)}
			>
				<form
					onSubmit={(e) => {
						e.preventDefault()
						handleSendMessage()
					}}
				>
					<TextArea
						fullWidth
						value={prompt}
						onChange={(e) => setPrompt(e.target.value)}
						onKeyDown={handleKeyDown}
						placeholder={OUTLINER_CHAT_PLACEHOLDERS[outlinerChatMode]}
						minHeight={40}
						maxHeight={100}
						unstyled={true}
						className="w-full resize-none outline-none"
					/>
					<div className="flex w-full items-center justify-end">
						{/* <OutlinerPromptDropDown /> */}
						<IconButton
							type={disabled || !hasText ? 'button' : 'submit'}
							label={'Send Message'}
							tooltip={'Send Message'}
							onClick={handleSendMessage}
							disabled={disabled || !hasText}
							className={cn(
								'bg-fm-primary size-6 p-0! transition-all duration-200',
								{
									'border-fm-divider-primary bg-transparent':
										disabled || !hasText,
								}
							)}
							variant={disabled || !hasText ? 'ghost' : 'outlined'}
							icon={
								<ArrowRightIcon
									width={10}
									height={10}
									className={cn(
										'text-fm-divider-primary -rotate-90 transition-colors duration-200',
										hasText ? 'text-fm-contrast' : ''
									)}
								/>
							}
						/>
					</div>
				</form>
			</div>
		</div>
	)
}

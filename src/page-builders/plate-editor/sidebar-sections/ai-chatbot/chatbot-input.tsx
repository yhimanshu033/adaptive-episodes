import React, { useState } from 'react'
import useAIChatbot from '@/hooks/use-ai-chatbot'
import ArrowRightIcon from '@/icons/arrow-right-icon'
import ChevronUpIcon from '@/icons/chevron-up-icon'
import { StopIcon } from '@/icons/stop-icon'
import { Settings } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { Button } from '@/components/aural-ui/button'
import { IconButton } from '@/components/aural-ui/icon-button'
import TextArea, { textareaVariants } from '@/components/aural-ui/textarea'
import { cn } from '@/lib/aural-ui/utils'

import { CheckboxDropdown } from './checkbox-dropdown'

const ChatbotInput = () => {
	const {
		disabled,
		handleSendMessage,
		handleKeyDown,
		input,
		setInput,
		cancelRequest,
	} = useAIChatbot()
	const [isFocused, setIsFocused] = useState(false)

	const dict = useTranslations('placeholders')
	const hasText = input.trim().length > 0

	return (
		<div
			className={cn(
				textareaVariants({
					variant: 'default',
				}),
				'w-auto rounded-md transition-all duration-200',
				{ 'border-fm-divider-contrast': isFocused }
			)}
		>
			<form onSubmit={handleSendMessage}>
				<TextArea
					fullWidth
					value={input}
					disabled={disabled}
					onChange={(e) => setInput(e.target.value)}
					onFocus={() => setIsFocused(true)}
					onBlur={() => setIsFocused(false)}
					onKeyDown={handleKeyDown}
					placeholder={dict('enterMessage')}
					minHeight={30}
					maxHeight={100}
					unstyled={true}
					className="w-full resize-none outline-none"
				/>
				<div className="bottom-2 flex w-full items-center justify-between">
					<CheckboxDropdown>
						<Button
							size="sm"
							variant="outline"
							className="text-fm-tertiary"
							innerClassName="border-none bg-fm-surface-frosted/20 h-6 !px-2"
							type="button"
						>
							<Settings size={12} />
							<p>Focus</p>
							<ChevronUpIcon className="w-4" />
						</Button>
					</CheckboxDropdown>
					<IconButton
						type={disabled ? 'button' : 'submit'}
						label={disabled ? 'Cancel Request' : 'Send Message'}
						tooltip={disabled ? 'Cancel Request' : 'Send Message'}
						onClick={disabled ? cancelRequest : handleSendMessage}
						className={cn(
							'bg-fm-primary size-6 !p-0 transition-all duration-200',
							{ 'border-fm-divider-primary bg-transparent': !hasText }
						)}
						variant={disabled ? 'ghost' : 'outlined'}
						icon={
							disabled ? (
								<StopIcon width={20} height={20} />
							) : (
								<ArrowRightIcon
									width={10}
									height={10}
									className={cn(
										'text-fm-divider-primary -rotate-90 transition-colors duration-200',
										hasText ? 'text-fm-contrast' : ''
									)}
								/>
							)
						}
					/>
				</div>
			</form>
		</div>
	)
}

export default ChatbotInput

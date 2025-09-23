'use client'

import React, { useState } from 'react'
import useBeatsheetStore from '@/store/beatsheet-store'
import { ArrowRightIcon, X } from 'lucide-react'

import { IconButton } from '@/components/aural-ui/icon-button'
import TextArea, { textareaVariants } from '@/components/aural-ui/textarea'
import { Typography } from '@/components/aural-ui/typography'
import { cn } from '@/lib/aural-ui/utils'

interface ScenePromptInlineProps {
	isOpen: boolean
	onClose: () => void
	onSubmit: (prompt: string) => void
}

export default function ScenePromptInline({
	isOpen,
	onClose,
	onSubmit,
}: ScenePromptInlineProps) {
	const [prompt, setPrompt] = useState('')
	const [isFocused, setIsFocused] = useState(false)
	const { setOpenPromptId } = useBeatsheetStore()

	const hasText = prompt.trim().length > 0

	const handleSubmit = () => {
		if (prompt.trim()) {
			onSubmit(prompt.trim())
			setPrompt('')
			onClose()
			setOpenPromptId(null)
		}
	}

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
			e.preventDefault()
			handleSubmit()
		}
	}

	const handleClose = () => {
		setPrompt('')
		onClose()
	}

	if (!isOpen) {
		return null
	}

	return (
		<div className="bg-background/80 absolute inset-0 z-15 flex flex-col rounded-lg backdrop-blur-sm">
			<div className="flex flex-1 flex-col p-4">
				<div className="mb-3 flex items-center justify-between">
					<div className="flex items-center gap-2">
						<Typography variant="body-small" className="font-medium">
							Scene Prompt
						</Typography>
					</div>
					<IconButton
						icon={<X size={14} />}
						onClick={handleClose}
						variant="ghost"
						size="small"
						label="Close"
					/>
				</div>

				<div
					className={cn(
						textareaVariants({
							variant: 'default',
						}),
						'w-auto rounded-md transition-all duration-200',
						isFocused ? 'border-fm-divider-contrast' : 'border-transparent'
					)}
				>
					<form
						onSubmit={(e) => {
							e.preventDefault()
							handleSubmit()
						}}
					>
						<TextArea
							fullWidth
							value={prompt}
							onChange={(e) => setPrompt(e.target.value)}
							onFocus={() => setIsFocused(true)}
							onBlur={() => setIsFocused(false)}
							onKeyDown={handleKeyDown}
							placeholder="Describe what you want to happen in this scene..."
							minHeight={80}
							maxHeight={120}
							unstyled={true}
							className="w-full resize-none outline-none"
						/>
						<div className="flex w-full items-center justify-between pb-2">
							<Typography
								variant="body-small"
								className="text-muted-foreground text-xs"
							>
								⌘↵ to send
							</Typography>
							<IconButton
								type="submit"
								label="Send Scene Prompt"
								onClick={handleSubmit}
								className={cn(
									'bg-fm-primary size-6 !p-0 transition-all duration-200',
									{ 'bg-transparent': !hasText }
								)}
								variant="outlined"
								disabled={!hasText}
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
		</div>
	)
}

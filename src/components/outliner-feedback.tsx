'use client'

import React, { useRef, useState } from 'react'
import { EFeedback } from '@/constants/analytics'
import { ThumbsDown, ThumbsUp } from 'lucide-react'

import { Button } from '@/components/aural-ui/button'
import { IconButton } from '@/components/aural-ui/icon-button'
import {
	Popover,
	PopoverAnchor,
	PopoverContent,
} from '@/components/aural-ui/popover'
import TextArea from '@/components/aural-ui/textarea'
import { cn } from '@/lib/aural-ui/utils'

interface OutlinerFeedbackProps {
	className?: string
	disablePopover?: boolean
	onDislike: (comment?: string) => void
	onLike: (comment?: string) => void
}

export function OutlinerFeedback({
	onLike,
	onDislike,
	disablePopover = false,
	className,
}: OutlinerFeedbackProps) {
	const [feedback, setFeedback] = useState<EFeedback | null>(null)
	const [comment, setComment] = useState('')
	const [isPopoverOpen, setIsPopoverOpen] = useState(false)
	const anchorRef = useRef<HTMLDivElement>(null)

	const handleLike = () => {
		if (disablePopover) {
			setFeedback(EFeedback.LIKE)
			onLike()
		} else {
			setFeedback(EFeedback.LIKE)
			setIsPopoverOpen(true)
		}
	}

	const handleDislike = () => {
		if (disablePopover) {
			setFeedback(EFeedback.DISLIKE)
			onDislike()
		} else {
			setFeedback(EFeedback.DISLIKE)
			setIsPopoverOpen(true)
		}
	}

	const handleSubmit = () => {
		if (feedback === EFeedback.LIKE) {
			onLike(comment || undefined)
		} else if (feedback === EFeedback.DISLIKE) {
			onDislike(comment || undefined)
		}
		setComment('')
		setIsPopoverOpen(false)
	}

	const handleCancel = () => {
		setComment('')
		setIsPopoverOpen(false)
		setFeedback(null)
	}

	return (
		<Popover
			open={isPopoverOpen && !disablePopover}
			onOpenChange={setIsPopoverOpen}
		>
			<div ref={anchorRef} className={cn('flex items-center gap-2', className)}>
				<PopoverAnchor asChild>
					<div />
				</PopoverAnchor>
				<IconButton
					label="Like"
					tooltip="Like"
					icon={
						<ThumbsUp
							className={cn('transition-colors', {
								'fill-current': feedback === EFeedback.LIKE,
							})}
						/>
					}
					size="small"
					variant="ghost"
					onClick={handleLike}
				/>
				<IconButton
					label="Dislike"
					tooltip="Dislike"
					icon={
						<ThumbsDown
							className={cn('transition-colors', {
								'fill-current': feedback === EFeedback.DISLIKE,
							})}
						/>
					}
					size="small"
					variant="ghost"
					onClick={handleDislike}
				/>
			</div>

			{!disablePopover && (
				<PopoverContent className="w-80 p-4" align="start">
					<div className="space-y-4">
						<div>
							<h4 className="text-fm-sm text-fm-neutral-1100 font-medium">
								{feedback === EFeedback.LIKE
									? 'What did you like?'
									: 'What can we improve?'}
							</h4>
							<TextArea
								placeholder="Your feedback helps us improve..."
								value={comment}
								onKeyDown={(e) => {
									if (e.key.toLowerCase() === 'enter') {
										e.preventDefault()
										handleSubmit()
									}
								}}
								onChange={(e) => setComment(e.target.value)}
								rows={3}
								autoGrow
								maxLength={500}
								showCharCount
							/>
						</div>
						<div className="flex items-center justify-end gap-2">
							<Button variant="text" size="sm" onClick={handleCancel}>
								Cancel
							</Button>
							<Button variant="outline" size="sm" onClick={handleSubmit}>
								Submit
							</Button>
						</div>
					</div>
				</PopoverContent>
			)}
		</Popover>
	)
}

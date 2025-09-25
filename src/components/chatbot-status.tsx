import React, { useMemo } from 'react'
import { AiAvatarIcon } from '@/icons/ai-avatar-icon'
import { AlertIcon } from '@/icons/alert-icon'
import { SpinnerSolidIcon } from '@/icons/spinner-solid-icon'
import { TickCircleIcon } from '@/icons/tick-circle-icon'

import { cn } from '@/lib/aural-ui/utils'

import { Typography } from './aural-ui/typography'

const ChatbotStatus = ({
	isRunning = true,
	isTimedOut = false,
	text,
	timeLeft,
	isCountdownActive = false,
}: {
	isCountdownActive?: boolean
	isRunning?: boolean
	isTimedOut?: boolean
	text?: string
	timeLeft?: number
}) => {
	const statusText = useMemo(() => {
		if (isTimedOut) {
			return 'Request timed out. Please try again.'
		}
		if (text) {
			return text
		}
		if (isRunning) {
			return `Thinking...`
		}
		return isRunning ? 'Thinking...' : 'Completed'
	}, [isTimedOut, text, isRunning])

	const timeLeftText = useMemo(() => {
		if (
			isRunning &&
			isCountdownActive &&
			timeLeft !== undefined &&
			timeLeft > 0
		) {
			const seconds = Math.ceil(timeLeft / 1000)
			return `(${seconds}s remaining)`
		}
		return ''
	}, [isRunning, isCountdownActive, timeLeft])

	const statusIcon = useMemo(() => {
		if (isTimedOut) {
			return <AlertIcon className="text-fm-error text-fm-warning-sec h-5 w-5" />
		}
		if (isRunning) {
			return <SpinnerSolidIcon className="h-5 w-5 animate-spin" />
		}
		return <TickCircleIcon className="text-fm-secondary-800 h-5 w-5" />
	}, [isTimedOut, isRunning])

	return (
		<div className="flex w-fit flex-col gap-2">
			<div className="flex items-center gap-3">
				<AiAvatarIcon className="h-6 w-6" />
				<Typography
					className={cn('!text-fm-md text-fm-secondary-800', {
						'animate-gradient-slide bg-clip-text text-transparent':
							isRunning && !isTimedOut,
						'text-fm-warning-sec': isTimedOut,
					})}
				>
					{statusText} {timeLeftText}
				</Typography>
				{statusIcon}
			</div>
		</div>
	)
}

export default ChatbotStatus

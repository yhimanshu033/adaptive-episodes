import React from 'react'
import { AiAvatarIcon } from '@/icons/ai-avatar-icon'
import { SpinnerSolidIcon } from '@/icons/spinner-solid-icon'
import { TickCircleIcon } from '@/icons/tick-circle-icon'
import { InfoIcon } from 'lucide-react'

import { cn } from '@/lib/aural-ui/utils'

import { Typography } from './aural-ui/typography'

const ChatbotStatus = ({
	isRunning,
	isError,
	text,
}: {
	isError?: boolean
	isRunning?: boolean
	text?: string
}) => {
	return (
		<div className="flex w-fit items-center gap-3">
			<AiAvatarIcon className="h-6 w-6" />
			<Typography
				className={cn('!text-fm-md text-fm-secondary-800', {
					'animate-gradient-slide bg-clip-text text-transparent': isRunning,
				})}
			>
				{text || (isRunning ? 'Thinking...' : 'Completed')}
			</Typography>
			{isRunning ? (
				<SpinnerSolidIcon className="h-5 w-5 animate-spin" />
			) : isError ? (
				<InfoIcon className="text-fm-secondary-800 h-5 w-5" />
			) : (
				<TickCircleIcon className="text-fm-secondary-800 h-5 w-5" />
			)}
		</div>
	)
}

export default ChatbotStatus

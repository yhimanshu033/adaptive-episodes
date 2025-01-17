import React from 'react'
import { COPILOT_LOGO_URL } from '@/constants/global-constants'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

import { EMessenger, TMessage } from '@/types/ai-types'

export function AILogo({ message }: { message: TMessage }) {
	if (message.role !== EMessenger.ASSISTANT) return null

	return (
		<Avatar className="mr-2">
			<AvatarImage src={COPILOT_LOGO_URL} alt="AI" />
			<AvatarFallback>AI</AvatarFallback>
		</Avatar>
	)
}

'use client'

import React from 'react'
import { setSidebar } from '@/store/plate-store'
import { Bot } from 'lucide-react'

import { ToolbarButton } from './toolbar'

export function ChatbotToolbarButton() {
	return (
		<ToolbarButton
			tooltip="Chatbot"
			onClick={() => setSidebar('chatbot', true)}
		>
			<Bot />
		</ToolbarButton>
	)
}

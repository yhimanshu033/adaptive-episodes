'use client'

import React from 'react'
import usePlateStore from '@/store/plate-store'
import { Bot } from 'lucide-react'

import { ToolbarButton } from './toolbar'

export function ChatbotToolbarButton() {
	const { store, setSidebar } = usePlateStore()
	const sidebar = store((state) => state.sidebar)
	return (
		<ToolbarButton
			variant={sidebar === 'chatbot' ? 'active' : 'default'}
			tooltip="StoryChat"
			onClick={() => setSidebar('chatbot', true)}
		>
			<Bot />
		</ToolbarButton>
	)
}

'use client'

import React from 'react'
import usePlateStore from '@/store/plate-store'
import { Bot } from 'lucide-react'
import { useShallow } from 'zustand/react/shallow'

import { ESidebar } from '@/types/plate-types'

import { ToolbarButton } from './toolbar'

export function ChatbotToolbarButton() {
	const { store, setSidebar } = usePlateStore()
	const sidebar = store(useShallow((state) => state.sidebar))
	return (
		<ToolbarButton
			variant={sidebar === ESidebar.CHATBOT ? 'active' : 'default'}
			tooltip="StoryChat"
			onClick={() => setSidebar(ESidebar.CHATBOT, true)}
		>
			<Bot />
		</ToolbarButton>
	)
}

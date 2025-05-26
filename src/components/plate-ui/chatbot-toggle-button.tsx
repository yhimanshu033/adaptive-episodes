'use client'

import React from 'react'
import usePlateStore from '@/store/plate-store'
import { Sidebar } from 'lucide-react'
import { useShallow } from 'zustand/react/shallow'

import { ToolbarButton } from '@/components/plate-ui/toolbar'

import { ESidebar } from '@/types/plate-types'

export function ChatbotToolbarButton() {
	const { store, setSidebar } = usePlateStore()
	const sidebar = store(useShallow((state) => state.sidebar))
	return (
		<ToolbarButton
			variant={sidebar === ESidebar.CHATBOT ? 'active' : 'default'}
			tooltip="StoryChat"
			onClick={() => setSidebar(ESidebar.CHATBOT, true)}
		>
			<Sidebar />
		</ToolbarButton>
	)
}

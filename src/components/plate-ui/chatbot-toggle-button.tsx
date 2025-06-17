'use client'

import React from 'react'
import { LayoutRightIcon } from '@/icons/layout-right-icon'
import usePlateStore from '@/store/plate-store'
import { useShallow } from 'zustand/react/shallow'

import { cn } from '@/lib/aural-ui/utils'

import { ESidebar } from '@/types/plate-types'

import { IconButton } from '../aural-ui/icon-button'

export function ChatbotToolbarButton() {
	const { store, setSidebar } = usePlateStore()
	const sidebar = store(useShallow((state) => state.sidebar))

	return (
		<IconButton
			icon={<LayoutRightIcon />}
			label="Toggle Episode Navigation"
			variant="outlined"
			size="small"
			onClick={() => setSidebar(sidebar ?? ESidebar.CHATBOT, true)}
			className={cn(
				'absolute top-1/2 -right-4 z-10 -translate-y-1/2 bg-black',
				{
					'bg-fm-secondary-50 text-fm-secondary-800':
						sidebar === ESidebar.CHATBOT || sidebar === ESidebar.OUTLINE,
				}
			)}
		/>
	)
}

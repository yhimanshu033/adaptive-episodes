'use client'

import React, { useMemo } from 'react'
import useIsOutlinerTester from '@/hooks/ugc/use-is-outliner-tester'
import { LayoutRightIcon } from '@/icons/layout-right-icon'
import usePlateStore from '@/store/plate-store'
import { useShallow } from 'zustand/react/shallow'

import { cn } from '@/lib/aural-ui/utils'

import { ESidebar } from '@/types/plate-types'

import { IconButton } from '../aural-ui/icon-button'

export function ChatbotToolbarButton() {
	const { store, setSidebar } = usePlateStore()
	const sidebar = store(useShallow((state) => state.sidebar))
	const isOutlinerTester = useIsOutlinerTester()

	const isSidebarButtonTriggered = useMemo(() => {
		if (isOutlinerTester) {
			return sidebar === ESidebar.OUTLINER
		}
		return sidebar === ESidebar.CHATBOT || sidebar === ESidebar.OUTLINE
	}, [sidebar, isOutlinerTester])

	return (
		<IconButton
			icon={<LayoutRightIcon />}
			label="Toggle Story Chat"
			variant="outlined"
			size="small"
			onClick={() =>
				setSidebar(isSidebarButtonTriggered ? null : ESidebar.CHATBOT)
			}
			className={cn(
				'absolute top-1/2 -right-4 z-50 -translate-y-1/2 bg-black',
				{
					'bg-fm-secondary-50 text-fm-secondary-800': isSidebarButtonTriggered,
				}
			)}
		/>
	)
}

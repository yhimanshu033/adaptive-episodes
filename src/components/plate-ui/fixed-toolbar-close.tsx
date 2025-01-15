'use client'

import React from 'react'
import usePlateStore from '@/store/plate-store'
import { X } from 'lucide-react'

import { ToolbarButton } from '@/components/plate-ui/toolbar'
import { cn } from '@/lib/utils'

export function FixedToolbarClose() {
	const { store, setSidebar } = usePlateStore()
	const sidebar = store((state) => state.sidebar)
	return (
		<ToolbarButton
			tooltip="Close"
			className={cn(
				'transition-all',
				!sidebar ? 'pointer-events-none opacity-0' : 'opacity-100'
			)}
			onClick={() => {
				setSidebar(null)
			}}
		>
			<X />
		</ToolbarButton>
	)
}

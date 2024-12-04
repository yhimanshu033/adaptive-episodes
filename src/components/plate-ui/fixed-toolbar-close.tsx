'use client'

import React from 'react'
import usePlateStore, { setSidebar } from '@/store/plate-store'
import { X } from 'lucide-react'

import { cn } from '@/lib/utils'

import { ToolbarButton } from './toolbar'

export function FixedToolbarClose() {
	const sidebar = usePlateStore((state) => state.sidebar)
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

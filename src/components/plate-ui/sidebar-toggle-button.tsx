'use client'

import React from 'react'
import usePlateStore from '@/store/plate-store'

import { Button, ButtonProps } from '@/components/ui/button'

import { ESidebar } from '@/types/plate-types'

export function SidebarToggleButton({
	sidebar,
	...props
}: ButtonProps & { sidebar: ESidebar }) {
	const { store, setSidebar } = usePlateStore()
	const currentSidebar = store((state) => state.sidebar)
	return (
		<Button
			variant={currentSidebar === sidebar ? 'default' : 'ghost'}
			className="px-2"
			onClick={() => setSidebar(sidebar, true)}
			{...props}
		>
			{props.children}
		</Button>
	)
}

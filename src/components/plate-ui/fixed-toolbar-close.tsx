'use client'

import React from 'react'
import usePlateStore, {
	setSidebar,
	setTranslationOpen,
} from '@/store/plate-store'
import { X } from 'lucide-react'

import { ToolbarButton } from './toolbar'

export function FixedToolbarClose() {
	const sidebar = usePlateStore((state) => state.sidebar)
	const translation = usePlateStore((state) => state.isTranslationOpen)
	return (
		(!!sidebar || !!translation) && (
			<ToolbarButton
				tooltip="Close"
				onClick={() => {
					setSidebar(null)
					setTranslationOpen(false)
				}}
			>
				<X />
			</ToolbarButton>
		)
	)
}

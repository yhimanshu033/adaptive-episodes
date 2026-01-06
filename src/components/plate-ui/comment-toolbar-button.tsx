'use client'

import React from 'react'
import usePlateStore from '@/store/plate-store'

import { Icons } from '@/components/icons'
import { ToolbarButton } from '@/components/plate-ui/toolbar'

import { ESidebar } from '@/types/plate-types'

export function CommentToolbarButton() {
	const { store, setSidebar } = usePlateStore()
	const sidebar = store((state) => state.sidebar)
	return (
		<ToolbarButton
			variant={sidebar === ESidebar.COMMENTS ? 'active' : 'default'}
			tooltip="Comments"
			onClick={() => setSidebar(ESidebar.COMMENTS, true)}
		>
			<Icons.comment />
		</ToolbarButton>
	)
}

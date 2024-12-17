'use client'

import React from 'react'
import usePlateStore from '@/store/plate-store'

import { Icons } from '@/components/icons'

import { ToolbarButton } from './toolbar'

export function CommentToolbarButton() {
	const { store, setSidebar } = usePlateStore()
	const sidebar = store((state) => state.sidebar)
	return (
		<ToolbarButton
			variant={sidebar === 'comments' ? 'active' : 'default'}
			tooltip="Comments"
			onClick={() => setSidebar('comments', true)}
		>
			<Icons.comment />
		</ToolbarButton>
	)
}

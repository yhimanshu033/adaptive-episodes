'use client'

import React from 'react'
import usePlateStore, { setSidebar } from '@/store/plate-store'

import { Icons } from '@/components/icons'

import { ToolbarButton } from './toolbar'

export function CommentToolbarButton() {
	const sidebar = usePlateStore((state) => state.sidebar)
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

'use client'

import React from 'react'
import { setSidebar } from '@/store/plate-store'

import { Icons } from '@/components/icons'

import { ToolbarButton } from './toolbar'

export function CommentToolbarButton() {
	return (
		<ToolbarButton
			tooltip="Comments"
			onClick={() => setSidebar('comments', true)}
		>
			<Icons.comment />
		</ToolbarButton>
	)
}

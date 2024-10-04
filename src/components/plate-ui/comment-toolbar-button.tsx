'use client'

import React from 'react'
import { toggleCommentSidebar } from '@/store/plate-store'

// import { useCommentAddButton } from '@udecode/plate-comments/react'

import { Icons } from '@/components/icons'

import { ToolbarButton } from './toolbar'

export function CommentToolbarButton() {
	// const { hidden, props } = useCommentAddButton()

	// if (hidden) return null

	return (
		<ToolbarButton tooltip="Comment (⌘+⇧+M)" onClick={toggleCommentSidebar}>
			<Icons.commentAdd />
		</ToolbarButton>
	)
}

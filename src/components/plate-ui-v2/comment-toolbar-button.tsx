'use client'

import * as React from 'react'
import { MessageSquareTextIcon } from 'lucide-react'
import { useEditorRef } from 'platejs/react'

import { commentPlugin } from '@/components/editor/plugins/comment-kit'

import { ToolbarButton } from './toolbar'

export function CommentToolbarButton({
	buttonProps,
}: {
	buttonProps?: React.ComponentProps<typeof ToolbarButton>
}) {
	const editor = useEditorRef()

	return (
		<ToolbarButton
			onClick={() => {
				editor.getTransforms(commentPlugin).comment.setDraft()
			}}
			data-plate-prevent-overlay
			tooltip="Comment"
			{...buttonProps}
		>
			<MessageSquareTextIcon />
		</ToolbarButton>
	)
}

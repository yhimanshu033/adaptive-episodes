'use client'

import React from 'react'
import { cn } from '@udecode/cn'
import {
	CommentNewSubmitButton,
	CommentNewTextarea,
	CommentsPlugin,
} from '@udecode/plate-comments/react'
import { useEditorPlugin } from '@udecode/plate-common/react'

import { buttonVariants } from '@/components/plate-ui/button'
import { CommentAvatar } from '@/components/plate-ui/comment-avatar'
import { inputVariants } from '@/components/plate-ui/input'

export function CommentCreateForm() {
	const { useOption, setOption } = useEditorPlugin(CommentsPlugin)

	const myUserId = useOption('myUserId')
	const activeCommentId = useOption('activeCommentId')
	const comments = useOption('comments')

	const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement, Element>) => {
		if (
			e.target.value === '' &&
			activeCommentId &&
			!comments[activeCommentId]
		) {
			setOption('activeCommentId', null)
		}
	}

	return (
		<div className="flex w-full space-x-2 p-2">
			<CommentAvatar userId={myUserId} />
			<div className="flex grow flex-col items-end gap-2">
				<CommentNewTextarea
					autoFocus
					onBlur={(e) => handleBlur(e)}
					className={inputVariants()}
				/>
				<CommentNewSubmitButton
					className={cn(buttonVariants({ size: 'sm' }), 'w-[90px]')}
				>
					Comment
				</CommentNewSubmitButton>
			</div>
		</div>
	)
}

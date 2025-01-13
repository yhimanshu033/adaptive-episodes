'use client'

import React from 'react'
import { AI_REVIEW_ID } from '@/constants/ai-constants'
import { cn } from '@udecode/cn'
import {
	useCommentDeleteButton,
	useCommentDeleteButtonState,
	useCommentEditButton,
	useCommentEditButtonState,
	useCommentItemContentState,
} from '@udecode/plate-comments/react'

import { Icons } from '@/components/icons'
import { Button } from '@/components/ui/button'

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from './dropdown-menu'

export function CommentMoreDropdown({ onExample }: { onExample: () => void }) {
	const editButtonState = useCommentEditButtonState()
	const { props: editProps } = useCommentEditButton(editButtonState)
	const deleteButtonState = useCommentDeleteButtonState()
	const { props: deleteProps } = useCommentDeleteButton(deleteButtonState)
	const { user, comment } = useCommentItemContentState()
	return (
		<DropdownMenu modal={false}>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" className={cn('h-6 p-1 text-muted-foreground')}>
					<Icons.more className="size-4" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				<DropdownMenuItem {...editProps}>Edit comment</DropdownMenuItem>
				<DropdownMenuItem {...deleteProps}>Delete comment</DropdownMenuItem>
				{user?.id === AI_REVIEW_ID && !comment?.parentId && (
					<DropdownMenuItem onClick={onExample}>Show Example</DropdownMenuItem>
				)}
			</DropdownMenuContent>
		</DropdownMenu>
	)
}

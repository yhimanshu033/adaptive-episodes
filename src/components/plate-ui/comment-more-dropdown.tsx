'use client'

import React from 'react'
import { AI_USER_ID } from '@/constants/ai-constants'
import { cn } from '@udecode/cn'
import {
	useCommentDeleteButton,
	useCommentDeleteButtonState,
	useCommentEditButton,
	useCommentEditButtonState,
	useCommentItemContentState,
} from '@udecode/plate-comments/react'

import { Icons } from '@/components/icons'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/plate-ui/dropdown-menu'
import { Button } from '@/components/ui/button'

export function CommentMoreDropdown({ onExample }: { onExample: () => void }) {
	const editButtonState = useCommentEditButtonState()
	const { props: editProps } = useCommentEditButton(editButtonState)
	const deleteButtonState = useCommentDeleteButtonState()
	const { props: deleteProps } = useCommentDeleteButton(deleteButtonState)
	const { user, comment } = useCommentItemContentState()

	return (
		<DropdownMenu modal={false}>
			<DropdownMenuTrigger asChild>
				<Button
					tooltip="More"
					variant="ghost"
					className={cn('h-6 p-1 text-muted-foreground')}
				>
					<Icons.more className="size-4" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				<DropdownMenuItem {...editProps}>Edit comment</DropdownMenuItem>
				<DropdownMenuItem {...deleteProps}>Delete comment</DropdownMenuItem>
				{user?.id === AI_USER_ID && !comment?.parentId && (
					<DropdownMenuItem onClick={onExample}>Show Example</DropdownMenuItem>
				)}
			</DropdownMenuContent>
		</DropdownMenu>
	)
}

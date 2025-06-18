'use client'

import React from 'react'
import { AI_USER_ID } from '@/constants/ai-constants'
import { EditBigIcon } from '@/icons/edit-big-icon'
import { PageSearchIcon } from '@/icons/page-search-icon'
import { VerticalMenuIcon } from '@/icons/test-icons'
import { TrashIcon } from '@/icons/trash-icon'
import {
	useCommentDeleteButton,
	useCommentDeleteButtonState,
	useCommentEditButton,
	useCommentEditButtonState,
	useCommentItemContentState,
} from '@udecode/plate-comments/react'

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/aural-ui/dropdown'

import { IconButton } from '../aural-ui/icon-button'

export function CommentMoreDropdown({ onExample }: { onExample: () => void }) {
	const editButtonState = useCommentEditButtonState()
	const { props: editProps } = useCommentEditButton(editButtonState)
	const deleteButtonState = useCommentDeleteButtonState()
	const { props: deleteProps } = useCommentDeleteButton(deleteButtonState)
	const { user, comment } = useCommentItemContentState()

	return (
		<DropdownMenu modal={false}>
			<DropdownMenuTrigger asChild>
				<IconButton
					label="Trigger dropdown"
					variant="ghost"
					icon={<VerticalMenuIcon className="size-4" />}
				></IconButton>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuItem {...editProps}>
					<EditBigIcon /> Edit comment
				</DropdownMenuItem>
				<DropdownMenuItem {...deleteProps}>
					<TrashIcon />
					Delete comment
				</DropdownMenuItem>
				{user?.id === AI_USER_ID && !comment?.parentId && (
					<DropdownMenuItem onClick={onExample}>
						<PageSearchIcon /> Show Example
					</DropdownMenuItem>
				)}
			</DropdownMenuContent>
		</DropdownMenu>
	)
}

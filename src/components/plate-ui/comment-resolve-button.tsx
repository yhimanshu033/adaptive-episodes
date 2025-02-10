'use client'

import React, { useCallback, useMemo } from 'react'
import useComments from '@/hooks/plate/use-comments'
import useEpisodeIdStore from '@/store/episode-id-store'
import usePlateStore from '@/store/plate-store'
import { cn } from '@udecode/cn'
import {
	useComment,
	useCommentDeleteButton,
	useCommentDeleteButtonState,
} from '@udecode/plate-comments/react'

import { Icons } from '@/components/icons'
import { Button } from '@/components/plate-ui/button'
import { buttonVariants } from '@/components/ui/button'

export function CommentResolveButton() {
	const comment = useComment()!
	const deleteButtonState = useCommentDeleteButtonState()
	const { props: deleteProps } = useCommentDeleteButton(deleteButtonState)
	const { addResolvedComment, removeResolvedComment } = useEpisodeIdStore()
	const { sortedComments } = useComments()

	const { store } = usePlateStore()
	const isResolved = store((state) => state.resolved)

	const currentComment = useMemo(
		() => sortedComments.find((c) => c.id === comment.id),
		[sortedComments, comment.id]
	)

	const handleResolve = useCallback(() => {
		if (isResolved) {
			removeResolvedComment(comment.id)
			return
		}
		if (!currentComment) return
		addResolvedComment(currentComment)
		deleteProps.onClick()
	}, [
		currentComment,
		addResolvedComment,
		removeResolvedComment,
		isResolved,
		deleteProps,
		comment.id,
	])

	return (
		<Button
			variant="ghost"
			{...deleteProps}
			onClick={handleResolve}
			className={cn(
				buttonVariants({ variant: 'ghost' }),
				'h-6 p-1 text-muted-foreground'
			)}
		>
			{comment.isResolved ? (
				<Icons.refresh className="size-4" />
			) : (
				<Icons.check className="size-4" />
			)}
		</Button>
	)
}

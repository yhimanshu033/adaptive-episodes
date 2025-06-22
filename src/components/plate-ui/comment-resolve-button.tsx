'use client'

import React, { useCallback, useMemo } from 'react'
import useComments from '@/hooks/plate/use-comments'
import { CircleCrossIcon } from '@/icons/circle-cross-icon'
import { CircleTickIcon } from '@/icons/circle-tick-icon'
import useEpisodeIdStore from '@/store/episode-id-store'
import usePlateStore from '@/store/plate-store'
import {
	useComment,
	useCommentDeleteButton,
	useCommentDeleteButtonState,
} from '@udecode/plate-comments/react'
import { toast } from 'sonner'

import useResolvedComments from '@/lib/plate/plugins/resolved-comments/use-resolved-comments'

import { IconButton } from '../aural-ui/icon-button'

export function CommentResolveButton() {
	const comment = useComment()!
	const deleteButtonState = useCommentDeleteButtonState()
	const { props: deleteProps } = useCommentDeleteButton(deleteButtonState)
	const { removeResolvedComment } = useEpisodeIdStore()
	const { sortedComments } = useComments()

	const { addResolvedComment } = useResolvedComments()

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
		if (!currentComment) {
			return
		}
		toast.success('Comment resolved successfully.')
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
		<IconButton
			label={comment.isResolved ? 'Unresolve' : 'Resolve'}
			variant="ghost"
			{...deleteProps}
			onClick={handleResolve}
			className="hover:!text-fm-primary text-fm-icon-inactive p-2"
			size="small"
			icon={
				comment.isResolved ? (
					<CircleCrossIcon className="size-4.5 text-inherit" />
				) : (
					<CircleTickIcon className="size-4.5 text-inherit" />
				)
			}
			tooltip={comment.isResolved ? 'Mark as Unresolved' : 'Mark as Resolved'}
			tooltipContentProps={{
				align: 'end',
				side: 'bottom',
			}}
		/>
	)
}

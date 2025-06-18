import React, { useEffect } from 'react'
import {
	CommentProvider,
	SCOPE_ACTIVE_COMMENT,
} from '@udecode/plate-comments/react'

import { CommentCreateForm } from '@/components/plate-ui/comment-create-form'
import { CommentItem } from '@/components/plate-ui/comment-item'
import { CommentReplyItems } from '@/components/plate-ui/comment-reply-items'
import { cn } from '@/lib/utils/helpers'

import { TCustomComment } from '@/types/editor-types'

export default function CommentCard({
	comment,
	activeCommentId,
	myUserId,
	setActiveComment,
}: {
	activeCommentId: string | null
	comment: TCustomComment
	myUserId: string | null
	setActiveComment: (comment: TCustomComment) => void
}) {
	const ref = React.useRef<HTMLDivElement>(null)

	const handleCommentCardClick = () => {
		setActiveComment(comment)
		const elem = document.getElementById('comment-leaf-' + comment.id)
		if (!elem) {
			return
		}
		elem?.scrollIntoView({ block: 'center', behavior: 'smooth' })
	}

	useEffect(() => {
		if (ref.current && activeCommentId === comment.id) {
			ref.current.scrollIntoView({
				behavior: 'smooth',
				block: 'nearest',
			})
		}
	}, [ref, activeCommentId, comment.id])
	return (
		<CommentProvider
			id={comment.id}
			key={comment.id}
			scope={SCOPE_ACTIVE_COMMENT}
		>
			<div
				ref={ref}
				role="button"
				onMouseDown={handleCommentCardClick}
				className={cn(
					'border-fm-divider-tertiary rounded-xs border bg-transparent p-4',
					{
						'border-fm-divider-secondary bg-fm-divider-secondary/15':
							activeCommentId === comment.id,
					}
				)}
			>
				<CommentItem commentId={comment.id} />
				{!!myUserId && activeCommentId === comment.id && (
					<>
						<CommentReplyItems />
						<CommentCreateForm />
					</>
				)}
			</div>
		</CommentProvider>
	)
}

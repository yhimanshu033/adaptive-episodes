import React, { useEffect } from 'react'
import {
	CommentProvider,
	SCOPE_ACTIVE_COMMENT,
} from '@udecode/plate-comments/react'
import { ReplyIcon } from 'lucide-react'

import { CommentCreateForm } from '@/components/plate-ui/comment-create-form'
import { CommentItem } from '@/components/plate-ui/comment-item'
import { CommentReplyItems } from '@/components/plate-ui/comment-reply-items'
import { cn } from '@/lib/utils/helpers'

import { TCustomComment } from '@/types/editor-types'

export default function CommentComponent({
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
				onMouseDown={() => {
					setActiveComment(comment)
					const elem = document.getElementById('comment-leaf-' + comment.id)
					if (!elem) return
					elem?.scrollIntoView({ block: 'center', behavior: 'smooth' })
				}}
				className={cn('p-4 hover:bg-[rgba(255,255,255,0.01)]', {
					'border-b border-b-yellow-600 bg-[rgba(255,255,255,0.01)]':
						activeCommentId === comment.id,
				})}
			>
				<div className="flex items-center gap-1 pb-2 text-xs text-muted-foreground">
					<ReplyIcon size={8} className="rotate-180" />
					<h1 className="w-64 truncate">{comment.node.text}</h1>
				</div>
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

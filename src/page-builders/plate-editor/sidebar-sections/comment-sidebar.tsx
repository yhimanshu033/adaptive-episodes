import React, { useCallback, useEffect } from 'react'
import useComments from '@/hooks/plate/use-comments'
import usePlateStore from '@/store/plate-store'
import { BaseCommentsPlugin } from '@udecode/plate-comments'
import {
	CommentProvider,
	SCOPE_ACTIVE_COMMENT,
} from '@udecode/plate-comments/react'
import { useEditorRef } from '@udecode/plate-common/react'
import { CheckCheck, ReplyIcon } from 'lucide-react'

import { CommentCreateForm } from '@/components/plate-ui/comment-create-form'
import { CommentItem } from '@/components/plate-ui/comment-item'
import { CommentReplyItems } from '@/components/plate-ui/comment-reply-items'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

import { TCustomComment } from '@/types/editor-types'

import Suggestions from './suggestions'

function CommentComponent({
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

export default function CommentSidebar() {
	const editor = useEditorRef()
	const { get, sortedComments, set, activeCommentId, commentExists } =
		useComments()
	const myUserId = get('myUserId')

	const setActiveComment = useCallback(
		(comment: TCustomComment) => {
			editor.setOption(BaseCommentsPlugin, 'activeCommentId', comment.id)
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[set, editor]
	)

	const unresolvedComments = [...sortedComments].filter(
		(comment) => !comment.isResolved
	)
	const resolvedComments = [...sortedComments].filter(
		(comment) => comment.isResolved
	)
	const { store, setResolved } = usePlateStore()
	const showResolved = store((state) => state.resolved)
	const comments = showResolved ? resolvedComments : unresolvedComments
	return (
		<div className="relative">
			<div className="pb-8 pt-4">
				<h1 className="w-full text-center">
					{!comments.length && (!myUserId || !activeCommentId)
						? `No ${showResolved ? 'resolved' : 'unresolved'} comments`
						: `${showResolved ? resolvedComments.length : unresolvedComments.length} ${showResolved ? 'resolved' : 'unresolved'} comments`}
				</h1>
			</div>
			<Button
				className="absolute left-2 top-1 z-50"
				variant={showResolved ? 'default' : 'outline'}
				size="icon"
				onClick={() => setResolved(true, true)}
			>
				<CheckCheck size={16} />
			</Button>
			{comments.map((comment) => (
				<CommentComponent
					key={comment.id}
					setActiveComment={setActiveComment}
					comment={comment}
					activeCommentId={activeCommentId}
					myUserId={myUserId}
				/>
			))}
			{!!myUserId && activeCommentId && !commentExists && <CommentCreateForm />}
			<Suggestions />
		</div>
	)
}

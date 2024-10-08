import React, { useCallback } from 'react'
import useComments from '@/hooks/plate/use-comments'
import usePlateStore from '@/store/plate-store'
import { BaseCommentsPlugin } from '@udecode/plate-comments'
import {
	CommentProvider,
	SCOPE_ACTIVE_COMMENT,
} from '@udecode/plate-comments/react'
import { useEditorRef } from '@udecode/plate-common/react'
import { ReplyIcon } from 'lucide-react'

import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'

import { TCustomComment } from '@/types/editor-types'

import { CommentCreateForm } from './comment-create-form'
import { CommentItem } from './comment-item'
import { CommentReplyItems } from './comment-reply-items'

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
	return (
		<CommentProvider
			id={comment.id}
			key={comment.id}
			scope={SCOPE_ACTIVE_COMMENT}
		>
			<div
				role="button"
				onMouseDown={() => {
					setActiveComment(comment)
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
	const { comments, get, sortedComments, set } = useComments()
	const activeCommentId = get('activeCommentId')
	const myUserId = get('myUserId')
	const { commentSidebarOpen } = usePlateStore()

	const commentExists = comments.find(
		(comment) => comment.id === activeCommentId
	)

	const setActiveComment = useCallback(
		(comment: TCustomComment) => {
			editor.setOption(BaseCommentsPlugin, 'activeCommentId', comment.id)
		},
		[set]
	)

	if (!commentSidebarOpen) return null
	return (
		<div className="relative h-[calc(100vh-44px)] border-l">
			<ScrollArea className="relative flex h-full min-w-[40vh] grow flex-col gap-2 overflow-y-scroll">
				<div className="p-4">
					{!comments.length && (!myUserId || !activeCommentId) && (
						<h1 className="w-full text-center">No comments</h1>
					)}
				</div>
				{sortedComments.map((comment) => (
					<CommentComponent
						key={comment.id}
						setActiveComment={setActiveComment}
						comment={comment}
						activeCommentId={activeCommentId}
						myUserId={myUserId}
					/>
				))}
				{!!myUserId && activeCommentId && !commentExists && (
					<CommentCreateForm />
				)}
			</ScrollArea>
		</div>
	)
}

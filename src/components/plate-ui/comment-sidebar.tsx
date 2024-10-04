import React from 'react'
import useComments from '@/hooks/plate/use-comments'
import usePlateStore from '@/store/plate-store'
import {
	CommentProvider,
	SCOPE_ACTIVE_COMMENT,
	useCommentAddButton,
	useFloatingCommentsState,
} from '@udecode/plate-comments/react'
import { isExpanded } from '@udecode/plate-common'
import { useEditorRef } from '@udecode/plate-common/react'

import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'

import { Button } from './button'
import { CommentCreateForm } from './comment-create-form'
import { CommentItem } from './comment-item'
import { CommentReplyItems } from './comment-reply-items'

export default function CommentSidebar() {
	const editor = useEditorRef()
	const { comments, get, sortedComments, set } = useComments()
	const { activeCommentId, loaded } = useFloatingCommentsState()
	const myUserId = get('myUserId')
	const { commentSidebarOpen } = usePlateStore()

	const { props } = useCommentAddButton()
	const commentExists = comments.find(
		(comment) => comment.id === activeCommentId
	)

	if (!commentSidebarOpen) return null
	return (
		<ScrollArea className="flex h-screen min-w-[40vh] grow flex-col gap-2 overflow-y-scroll border-l">
			<div className="p-4">
				{!comments.length &&
					(commentExists || !isExpanded(editor.selection)) &&
					(!myUserId || !loaded || !activeCommentId) && (
						<h1 className="w-full text-center">No comments</h1>
					)}
				{!commentExists && isExpanded(editor.selection) && (
					<Button className="w-full" {...props}>
						Comment
					</Button>
				)}
			</div>
			{sortedComments.map((comment) => (
				<CommentProvider
					id={comment.id}
					key={comment.id}
					scope={SCOPE_ACTIVE_COMMENT}
				>
					<div
						onClick={() => set({ activeCommentId: comment.id })}
						className={cn('p-4 hover:bg-[rgba(255,255,255,0.01)]', {
							'bg-[rgba(255,255,255,0.01)]': activeCommentId === comment.id,
						})}
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
			))}
			{!!myUserId && loaded && activeCommentId && !commentExists && (
				<CommentCreateForm />
			)}
		</ScrollArea>
	)
}

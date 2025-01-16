import React, { useCallback } from 'react'
import useComments from '@/hooks/plate/use-comments'
import CommentComponent from '@/page-builders/plate-editor/sidebar-sections/comment-sidebar/comment'
import Suggestions from '@/page-builders/plate-editor/sidebar-sections/comment-sidebar/suggestions'
import usePlateStore from '@/store/plate-store'
import { BaseCommentsPlugin } from '@udecode/plate-comments'
import { useEditorRef } from '@udecode/plate-common/react'
import { CheckCheck } from 'lucide-react'

import { CommentCreateForm } from '@/components/plate-ui/comment-create-form'
import { Button } from '@/components/ui/button'

import { TCustomComment } from '@/types/editor-types'

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

import React, { useCallback } from 'react'
import useComments from '@/hooks/plate/use-comments'
import CommentComponent from '@/page-builders/plate-editor/sidebar-sections/comment-sidebar/comment'
import ResolvedCommentItem from '@/page-builders/plate-editor/sidebar-sections/comment-sidebar/resolved-comment'
import SuggestionBlock from '@/page-builders/plate-editor/sidebar-sections/comment-sidebar/suggestions'
import usePlateStore from '@/store/plate-store'
import { CheckCheck } from 'lucide-react'

import { CommentCreateForm } from '@/components/plate-ui/comment-create-form'
import { Button } from '@/components/ui/button'

import { EReviewType } from '@/types/editor-types'

export default function CommentSidebar() {
	const {
		get,
		activeCommentId,
		commentExists,
		setActiveComment,
		resolvedComments,
		commentsAndDescriptions,
	} = useComments()
	const myUserId = get('myUserId')

	const { store, setResolved } = usePlateStore()
	const showResolved = store((state) => state.resolved)

	const RenderReviews = useCallback(() => {
		if (showResolved) {
			return resolvedComments.map((item, idx) => (
				<ResolvedCommentItem
					key={`resolved-${item.id}-${idx}`}
					resolvedComment={item}
				/>
			))
		}
		return commentsAndDescriptions.map((item, index) => {
			if (item.type === EReviewType.COMMENT) {
				return (
					<CommentComponent
						key={`comment-${item.data.id}-${index}`}
						setActiveComment={setActiveComment}
						comment={item.data}
						activeCommentId={activeCommentId}
						myUserId={myUserId}
					/>
				)
			}
			return (
				<SuggestionBlock key={`suggestion-${index}`} description={item.data} />
			)
		})
	}, [
		showResolved,
		resolvedComments,
		commentsAndDescriptions,
		activeCommentId,
		setActiveComment,
		myUserId,
	])

	const commentType = showResolved ? 'resolved' : 'unresolved'
	const commentCount = showResolved
		? resolvedComments.length
		: commentsAndDescriptions.length

	return (
		<div className="relative">
			<div className="pt-4 pb-8">
				<h1 className="w-full text-center">
					{!commentCount && (!myUserId || !activeCommentId)
						? `No ${showResolved ? 'resolved' : 'unresolved'} comments`
						: `${commentCount} ${commentType} comments`}
				</h1>
			</div>
			<Button
				className="absolute top-1 left-2 z-50"
				variant={showResolved ? 'default' : 'outline'}
				size="icon"
				onClick={() => setResolved(true, true)}
				tooltip={
					showResolved ? 'Show Unresolved Comments' : 'Show Resolved Comments'
				}
			>
				<CheckCheck size={16} />
			</Button>
			<RenderReviews />
			{!!myUserId && activeCommentId && !commentExists && (
				<CommentCreateForm autoFocus />
			)}
		</div>
	)
}

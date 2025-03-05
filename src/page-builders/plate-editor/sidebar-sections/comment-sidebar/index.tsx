import React, { useCallback, useMemo } from 'react'
import useComments from '@/hooks/plate/use-comments'
import useSuggestions from '@/hooks/plate/use-suggestions'
import CommentComponent from '@/page-builders/plate-editor/sidebar-sections/comment-sidebar/comment'
import ResolvedCommentItem from '@/page-builders/plate-editor/sidebar-sections/comment-sidebar/resolved-comment'
import SuggestionBlock from '@/page-builders/plate-editor/sidebar-sections/comment-sidebar/suggestions'
import usePlateStore from '@/store/plate-store'
import { BaseCommentsPlugin } from '@udecode/plate-comments'
import { useEditorState } from '@udecode/plate-common/react'
import { CheckCheck } from 'lucide-react'

import { CommentCreateForm } from '@/components/plate-ui/comment-create-form'
import { Button } from '@/components/ui/button'
import useResolvedComments from '@/lib/plate/plugins/resolved-comments/use-resolved-comments'
import { sortCommentsAndDescriptions } from '@/lib/utils/plate'

import { EReviewType, TCustomComment, TReview } from '@/types/editor-types'

export default function CommentSidebar() {
	const editor = useEditorState()
	const { get, sortedComments, activeCommentId, commentExists } = useComments()
	const myUserId = get('myUserId')
	const { getAllSuggestionDescriptions } = useSuggestions()
	const descriptions = getAllSuggestionDescriptions(editor)

	const { resolvedComments } = useResolvedComments()

	const setActiveComment = useCallback(
		(comment: TCustomComment) => {
			editor.setOption(BaseCommentsPlugin, 'activeCommentId', comment.id)
		},
		[editor]
	)

	const unresolvedComments = [...sortedComments].filter(
		(comment) => !comment.isResolved
	)

	const { store, setResolved } = usePlateStore()
	const showResolved = store((state) => state.resolved)

	const commentsAndDescriptions: TReview[] = useMemo(
		() =>
			sortCommentsAndDescriptions(
				editor.children,
				unresolvedComments,
				descriptions
			),
		[editor.children, unresolvedComments, descriptions]
	)

	const RenderReviews = useCallback(() => {
		if (showResolved) {
			return resolvedComments.map((item, idx) => (
				<ResolvedCommentItem key={idx} resolvedComment={item} />
			))
		}
		return commentsAndDescriptions.map((item, index) => {
			if (item.type === EReviewType.COMMENT) {
				return (
					<CommentComponent
						key={index}
						setActiveComment={setActiveComment}
						comment={item.data}
						activeCommentId={activeCommentId}
						myUserId={myUserId}
					/>
				)
			}
			return <SuggestionBlock key={index} description={item.data} />
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
			<div className="pb-8 pt-4">
				<h1 className="w-full text-center">
					{!commentCount && (!myUserId || !activeCommentId)
						? `No ${showResolved ? 'resolved' : 'unresolved'} comments`
						: `${commentCount} ${commentType} comments`}
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
			<RenderReviews />
			{!!myUserId && activeCommentId && !commentExists && (
				<CommentCreateForm autoFocus />
			)}
		</div>
	)
}

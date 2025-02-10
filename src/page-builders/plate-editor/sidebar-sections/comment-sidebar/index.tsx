import React, { useCallback, useMemo } from 'react'
import useComments from '@/hooks/plate/use-comments'
import useSuggestions from '@/hooks/plate/use-suggestions'
import CommentComponent from '@/page-builders/plate-editor/sidebar-sections/comment-sidebar/comment'
import SuggestionBlock from '@/page-builders/plate-editor/sidebar-sections/comment-sidebar/suggestions'
import useEpisodeIdStore from '@/store/episode-id-store'
import usePlateStore from '@/store/plate-store'
import { BaseCommentsPlugin } from '@udecode/plate-comments'
import { useEditorState } from '@udecode/plate-common/react'
import { CheckCheck } from 'lucide-react'
import { useShallow } from 'zustand/react/shallow'

import { CommentCreateForm } from '@/components/plate-ui/comment-create-form'
import { Button } from '@/components/ui/button'
import { sortCommentsAndDescriptions } from '@/lib/utils/plate'

import { EReviewType, TCustomComment, TReview } from '@/types/editor-types'

export default function CommentSidebar() {
	const editor = useEditorState()
	const { get, sortedComments, activeCommentId, commentExists } = useComments()
	const myUserId = get('myUserId')
	const { getAllSuggestionDescriptions } = useSuggestions()
	const descriptions = getAllSuggestionDescriptions(editor)

	const { store: useEpisodeIdContextStore } = useEpisodeIdStore()
	const resolvedComments = useEpisodeIdContextStore(
		useShallow((state) => state.resolvedComments)
	)

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
			showResolved
				? resolvedComments.map((item) => ({
						data: item,
						type: EReviewType.COMMENT,
					}))
				: sortCommentsAndDescriptions(
						editor.children,
						unresolvedComments,
						descriptions
					),
		[
			editor.children,
			unresolvedComments,
			resolvedComments,
			showResolved,
			descriptions,
		]
	)

	return (
		<div className="relative">
			<div className="pb-8 pt-4">
				<h1 className="w-full text-center">
					{!commentsAndDescriptions.length && (!myUserId || !activeCommentId)
						? `No ${showResolved ? 'resolved' : 'unresolved'} comments`
						: `${commentsAndDescriptions.length} ${showResolved ? 'resolved' : 'unresolved'} comments`}
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
			{commentsAndDescriptions.map((item, index) => {
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
				} else if (item.type === EReviewType.DESCRIPTION) {
					return <SuggestionBlock key={index} description={item.data} />
				}
				return null
			})}
			{!!myUserId && activeCommentId && !commentExists && <CommentCreateForm />}
		</div>
	)
}

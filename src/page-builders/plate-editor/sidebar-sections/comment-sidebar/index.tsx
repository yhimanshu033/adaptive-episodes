import React, { useCallback, useMemo } from 'react'
import useComments from '@/hooks/plate/use-comments'
import useSuggestions from '@/hooks/plate/use-suggestions'
import CommentComponent from '@/page-builders/plate-editor/sidebar-sections/comment-sidebar/comment'
import SuggestionBlock from '@/page-builders/plate-editor/sidebar-sections/comment-sidebar/suggestions'
import usePlateStore from '@/store/plate-store'
import { BaseCommentsPlugin } from '@udecode/plate-comments'
import { useEditorState } from '@udecode/plate-common/react'
import { CheckCheck } from 'lucide-react'

import { CommentCreateForm } from '@/components/plate-ui/comment-create-form'
import { Button } from '@/components/ui/button'
import { sortCommentsAndDescriptions } from '@/lib/utils/plate'

import { TCustomComment } from '@/types/editor-types'

export default function CommentSidebar() {
	const editor = useEditorState()
	const { get, sortedComments, set, activeCommentId, commentExists } =
		useComments()
	const myUserId = get('myUserId')
	const { getAllSuggestionDescriptions } = useSuggestions()
	const descriptions = getAllSuggestionDescriptions(editor)

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

	const commentsAndDescriptions = useMemo(
		() => sortCommentsAndDescriptions(editor.children, comments, descriptions),
		[editor.children, comments, descriptions]
	)

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
			{commentsAndDescriptions.map((item, index) => {
				if (item.type === 'comment') {
					return (
						<CommentComponent
							key={index}
							setActiveComment={setActiveComment}
							comment={item.data}
							activeCommentId={activeCommentId}
							myUserId={myUserId}
						/>
					)
				} else if (item.type === 'description') {
					return <SuggestionBlock key={index} description={item.data} />
				}
				return null
			})}
			{!!myUserId && activeCommentId && !commentExists && <CommentCreateForm />}
		</div>
	)
}

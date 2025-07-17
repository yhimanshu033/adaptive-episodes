import React, { useCallback, useMemo } from 'react'
import useComments from '@/hooks/plate/use-comments'
import useSuggestions from '@/hooks/plate/use-suggestions'
import { FilterBarRowIcon } from '@/icons/filter-bar-row-icon'
import { TickIcon } from '@/icons/tick-icon'
import ResolvedCommentItem from '@/page-builders/plate-editor/sidebar-sections/comment-sidebar/resolved-comment'
import SuggestionBlock from '@/page-builders/plate-editor/sidebar-sections/comment-sidebar/suggestions'
import usePlateStore from '@/store/plate-store'
import { CommentPlugin } from '@platejs/comment/react'
import { SuggestionPlugin } from '@platejs/suggestion/react'
import {
	useEditorPlugin,
	useEditorRef,
	useEditorState,
	usePluginOption,
} from 'platejs/react'

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/aural-ui/dropdown'
import { IconButton } from '@/components/aural-ui/icon-button'
import { If } from '@/components/aural-ui/if-else'
import { ScrollArea } from '@/components/aural-ui/scroll-area'
import { commentPlugin } from '@/components/editor/plugins/comment-kit'
import { discussionPlugin } from '@/components/editor/plugins/discussion-kit'
import { CommentCreateForm } from '@/components/plate-ui/comment-create-form'
import { cn } from '@/lib/aural-ui/utils'
import useResolvedComments from '@/lib/plate/plugins/resolved-comments/use-resolved-comments'
import { sortCommentsAndDescriptions } from '@/lib/utils/plate'

import { EReviewType, TCustomComment, TReview } from '@/types/editor-types'

import CommentCard from './comment-card'
import EmptyState from './empty-state'

export default function CommentSidebar() {
	const editor = useEditorRef()
	// const { get, sortedComments, activeCommentId, commentExists } = useComments()
	const { setOption: setDiscussionOption, getOption: getDiscussionOption } =
		useEditorPlugin(discussionPlugin)
	const myUserId = getDiscussionOption('currentUserId')

	const commentsApi = editor.getApi(CommentPlugin).comment
	const suggestionApi = editor.getApi(SuggestionPlugin).suggestion

	const commentNodes = [...commentsApi.nodes({ at: [] })]
	const suggestionNodes = [...suggestionApi.nodes({ at: [] })]

	const comments = 

	const { resolvedComments } = useResolvedComments()

	const setActiveComment = useCallback(
		(comment: TCustomComment) => {
			editor.setOption(CommentPlugin, 'activeCommentId', comment.id)
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
			if (resolvedComments.length === 0) {
				return (
					<EmptyState description="No resolved comments yet. Once you resolve a comment, it will appear here" />
				)
			}
			return resolvedComments.map((item, idx) => (
				<ResolvedCommentItem key={idx} resolvedComment={item} />
			))
		}

		if (commentsAndDescriptions.length === 0) {
			return (
				<EmptyState
					description="No comments yet. Share your thoughts and start the conversation."
					classes={{ description: 'px-4' }}
				/>
			)
		}

		return commentsAndDescriptions.map((item, index) => {
			if (item.type === EReviewType.COMMENT) {
				return (
					<CommentCard
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

	return (
		<div className="bg-fm-surface-primary flex h-full flex-col">
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<IconButton
						label="Filter comments"
						icon={
							<FilterBarRowIcon
								className={cn('size-4 stroke-2', {
									'text-fm-hotpink-600': showResolved,
								})}
							/>
						}
						className={cn('absolute top-3.5 right-15 z-20', {
							'bg-fm-hotpink-50 hover:bg-fm-hotpink-100/80': showResolved,
						})}
						variant="ghost"
						shape="square"
						size="small"
					/>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					<DropdownMenuItem onClick={() => setResolved(true, true)}>
						<If condition={showResolved}>
							<TickIcon />
						</If>
						Resolved comments
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>

			<ScrollArea
				className="h-full"
				classes={{
					viewport: '[&>div]:min-h-full [&>div]:h-full',
				}}
			>
				<div className="flex h-full flex-col gap-3 p-4">
					<RenderReviews />
					{!!myUserId && activeCommentId && !commentExists && (
						<CommentCreateForm autoFocus />
					)}
				</div>
			</ScrollArea>
		</div>
	)
}

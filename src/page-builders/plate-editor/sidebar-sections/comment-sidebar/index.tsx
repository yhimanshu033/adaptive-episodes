import React, { useCallback } from 'react'
import useComments from '@/hooks/plate/use-comments'
import { FilterBarRowIcon } from '@/icons/filter-bar-row-icon'
import { TickIcon } from '@/icons/tick-icon'
import ResolvedCommentItem from '@/page-builders/plate-editor/sidebar-sections/comment-sidebar/resolved-comment'
import SuggestionBlock from '@/page-builders/plate-editor/sidebar-sections/comment-sidebar/suggestions'
import usePlateStore from '@/store/plate-store'

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/aural-ui/dropdown'
import { IconButton } from '@/components/aural-ui/icon-button'
import { If } from '@/components/aural-ui/if-else'
import { ScrollArea } from '@/components/aural-ui/scroll-area'
import { CommentCreateForm } from '@/components/plate-ui/comment-create-form'
import { cn } from '@/lib/aural-ui/utils'

import { EReviewType } from '@/types/editor-types'

import CommentCard from './comment-card'
import EmptyState from './empty-state'

export default function CommentSidebar() {
	const {
		get,
		activeCommentId,
		commentExists,
		setActiveComment,
		resolvedComments,
		commentsAndDescriptions,
		addComment,
	} = useComments()
	const myUserId = get('myUserId')

	const { store, setResolved } = usePlateStore()
	const showResolved = store((state) => state.resolved)

	const RenderReviews = useCallback(() => {
		if (showResolved) {
			if (resolvedComments.length === 0) {
				return (
					<EmptyState description="No resolved comments yet. Once you resolve a comment, it will appear here" />
				)
			}
			return resolvedComments.map((item, idx) => (
				<ResolvedCommentItem
					key={`resolved-${item.id}-${idx}`}
					resolvedComment={item}
					addComment={addComment}
				/>
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
		commentsAndDescriptions,
		resolvedComments,
		addComment,
		setActiveComment,
		activeCommentId,
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

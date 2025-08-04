import React, { memo, useCallback, useEffect, useMemo, useRef } from 'react'
import { useComments, useSuggestions } from '@/hooks/plate/use-discussions'
import { FilterBarRowIcon } from '@/icons/filter-bar-row-icon'
import { TickIcon } from '@/icons/tick-icon'
import usePlateStore from '@/store/plate-store'
import { useVirtualizer } from '@tanstack/react-virtual'
import { useEditorRef } from 'platejs/react'

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/aural-ui/dropdown'
import { IconButton } from '@/components/aural-ui/icon-button'
import { If } from '@/components/aural-ui/if-else'
import { ScrollArea } from '@/components/aural-ui/scroll-area'
import { TDiscussion } from '@/components/editor/plugins/discussion-kit'
import {
	BlockSuggestionCard,
	isResolvedSuggestion,
	ResolvedSuggestion,
} from '@/components/plate-ui-v2/block-suggestion'
import { CommentCreateForm } from '@/components/plate-ui-v2/comment'
import { cn } from '@/lib/aural-ui/utils'
import { sortCommentsAndSuggestions } from '@/lib/utils/plate'

import CommentCard from './comment-card'
import EmptyState from './empty-state'
import ResolvedCommentItem from './resolved-comment'

// Memoized components for better performance
const MemoizedCommentCard = memo(CommentCard)
const MemoizedBlockSuggestionCard = memo(BlockSuggestionCard)

export default function CommentSidebar() {
	const editor = useEditorRef()
	const scrollAreaRef = useRef<HTMLDivElement>(null)

	const { store, setResolved } = usePlateStore()
	const showResolved = store((state) => state.resolved)

	const {
		resolvedComments,
		unresolvedComments,
		activeCommentId,
		isCommenting,
		getDiscussionOption,
	} = useComments()

	const { suggestions, activeSuggestionId } = useSuggestions()

	const myUserId = getDiscussionOption('currentUserId')
	const currentActiveId = activeCommentId || activeSuggestionId

	const commentsAndSuggestions = useMemo(
		() => sortCommentsAndSuggestions(editor, unresolvedComments, suggestions),
		[editor, unresolvedComments, suggestions]
	)

	const itemIndexMap = useMemo(() => {
		const map = new Map<string, number>()

		commentsAndSuggestions.forEach((item, index) => {
			if (isResolvedSuggestion(item)) {
				map.set(item.suggestionId, index)
			} else {
				map.set(item.id, index)
			}
		})

		return map
	}, [commentsAndSuggestions])

	const items = showResolved ? resolvedComments : commentsAndSuggestions

	const getScrollElement = useCallback(() => {
		return scrollAreaRef.current?.querySelector(
			'[data-radix-scroll-area-viewport]'
		) as HTMLElement
	}, [])

	const virtualizer = useVirtualizer({
		count: items.length,
		getScrollElement,
		estimateSize: () => 130,
		measureElement: useCallback((element: Element) => {
			return element.getBoundingClientRect().height
		}, []),
		overscan: items.length > 50 ? 5 : 2,
	})

	const renderItem = useCallback(
		(item: TDiscussion | ResolvedSuggestion, index: number) => {
			if (showResolved && !isResolvedSuggestion(item)) {
				return <ResolvedCommentItem resolvedComment={item} />
			}

			if (!isResolvedSuggestion(item)) {
				return (
					<MemoizedCommentCard
						discussion={item}
						activeId={activeCommentId}
						myUserId={myUserId}
					/>
				)
			}

			return (
				<MemoizedBlockSuggestionCard
					idx={index}
					suggestion={item}
					isLast={index === commentsAndSuggestions.length - 1}
				/>
			)
		},
		[activeCommentId, myUserId, commentsAndSuggestions.length, showResolved]
	)

	const VirtualizedList = useCallback(() => {
		if (items.length === 0) {
			const description = showResolved
				? 'No resolved comments yet. Once you resolve a comment, it will appear here'
				: 'No comments yet. Share your thoughts and start the conversation.'

			return (
				<EmptyState
					description={description}
					classes={{ description: 'px-4' }}
				/>
			)
		}

		return (
			<ScrollArea
				ref={scrollAreaRef}
				className="h-[calc(100vh-169px)]"
				classes={{
					viewport: 'max-h-full',
				}}
			>
				<div className="p-4">
					<div
						style={{
							height: `${virtualizer.getTotalSize()}px`,
							width: '100%',
							position: 'relative',
						}}
					>
						{virtualizer.getVirtualItems().map((virtualItem) => {
							const item = items[virtualItem.index]
							if (!item) {
								return null
							}

							return (
								<div
									key={virtualItem.key}
									data-index={virtualItem.index}
									ref={virtualizer.measureElement}
									style={{
										position: 'absolute',
										top: 0,
										left: 0,
										width: '100%',
										transform: `translateY(${virtualItem.start}px)`,
									}}
								>
									<div className="pb-3">
										{renderItem(item, virtualItem.index)}
									</div>
								</div>
							)
						})}
					</div>
				</div>
			</ScrollArea>
		)
	}, [virtualizer, items, renderItem, showResolved])

	useEffect(() => {
		if (!currentActiveId || showResolved) {
			return
		}
		const activeIndex = itemIndexMap.get(currentActiveId) ?? -1
		if (activeIndex === -1) {
			return
		}
		virtualizer.scrollToIndex(activeIndex, {
			align: 'start',
		})
	}, [currentActiveId, itemIndexMap, virtualizer, showResolved])

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

			<div className="relative flex h-full flex-col">
				<VirtualizedList />
				{!!myUserId && activeCommentId && isCommenting && (
					<div className="bg-fm-surface-primary border-fm-divider-tertiary absolute inset-x-0 bottom-0 border-t p-4">
						<CommentCreateForm focusOnMount />
					</div>
				)}
			</div>
		</div>
	)
}

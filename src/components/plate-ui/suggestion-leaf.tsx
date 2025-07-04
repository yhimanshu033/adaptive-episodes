/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React, { useCallback, useMemo } from 'react'
import { SuggestionActions } from '@/constants/editor-constants'
import useSuggestions from '@/hooks/plate/use-suggestions'
import usePlateStore from '@/store/plate-store'
import { CommentsPlugin } from '@udecode/plate-comments/react'
import {
	PlateLeaf,
	PlateLeafProps,
	useEditorPlugin,
} from '@udecode/plate-common/react'
import { TSuggestionText } from '@udecode/plate-suggestion'
import { Check, X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils/helpers'

import { ESidebar } from '@/types/plate-types'

const SuggestionLeaf = ({
	className,
	...props
}: PlateLeafProps<TSuggestionText>) => {
	const { children, leaf, nodeProps } = props
	const { activeSuggestionId, set, suggestionAction, isLastLeaf } =
		useSuggestions()

	const { setOption: setCommentOption, useOption } =
		useEditorPlugin(CommentsPlugin)
	const activeCommentId = useOption('activeCommentId')

	const { setSidebar, setResolved } = usePlateStore()

	// Memoize active state calculation
	const isActive = useMemo(
		() =>
			activeCommentId
				? false
				: activeSuggestionId === leaf.suggestionId && isLastLeaf(leaf),
		[activeCommentId, activeSuggestionId, isLastLeaf, leaf]
	)

	// Memoize className calculation
	const leafClassName = useMemo(
		() =>
			cn(
				'relative border-b-2 border-b-green-800/20 bg-green-600/40 hover:bg-green-600/80',
				leaf.suggestionDeletion && 'italic line-through',
				isActive && 'bg-green-600/80',
				className
			),
		[leaf.suggestionDeletion, isActive, className]
	)

	// Memoize click handler to prevent recreation on every render
	const handleClick = useCallback(() => {
		setCommentOption('activeCommentId', null)
		set('activeSuggestionId', leaf.suggestionId || '')
		setSidebar(ESidebar.COMMENTS)
		setResolved(false)
	}, [setCommentOption, set, leaf.suggestionId, setSidebar, setResolved])

	// Memoize accept handler
	const handleAccept = useCallback(
		(e: React.MouseEvent) => {
			e.stopPropagation()
			suggestionAction(SuggestionActions.ACCEPT)
		},
		[suggestionAction]
	)

	// Memoize reject handler
	const handleReject = useCallback(
		(e: React.MouseEvent) => {
			e.stopPropagation()
			suggestionAction(SuggestionActions.REJECT)
		},
		[suggestionAction]
	)

	// Memoize suggestion ID for DOM element
	const suggestionElementId = useMemo(
		() => `suggestion-leaf-${leaf.suggestionId}`,
		[leaf.suggestionId]
	)

	return (
		<PlateLeaf
			{...props}
			id={suggestionElementId}
			className={leafClassName}
			onClick={handleClick}
			nodeProps={{ ...nodeProps }}
		>
			{isActive && (
				<div className="absolute right-0 bottom-0 z-50 flex translate-x-1/2 translate-y-full gap-2 p-1">
					<Button
						variant="outline"
						size="sm"
						tooltip="Accept"
						onClick={handleAccept}
					>
						<Check size={16} />
					</Button>
					<Button
						variant="outline"
						tooltip="Reject"
						size="sm"
						onClick={handleReject}
					>
						<X size={16} />
					</Button>
				</div>
			)}

			{children}
		</PlateLeaf>
	)
}

SuggestionLeaf.displayName = 'SuggestionLeaf'

export default SuggestionLeaf

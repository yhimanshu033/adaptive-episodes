/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React from 'react'
// import { SuggestionActions } from '@/constants/editor-constants'
import useComments from '@/hooks/plate/use-comments'
import useSuggestions from '@/hooks/plate/use-suggestions'
import usePlateStore from '@/store/plate-store'
import { PlateLeaf, PlateLeafProps } from '@udecode/plate-common/react'
import { TSuggestionText } from '@udecode/plate-suggestion'

import { cn } from '@/lib/utils/helpers'

import { ESidebar } from '@/types/plate-types'

export default function SuggestionLeaf({
	className,
	...props
}: PlateLeafProps<TSuggestionText>) {
	const { children, leaf, nodeProps } = props
	const {
		// activeSuggestionId,
		set,
		//  suggestionAction, isLastLeaf
	} = useSuggestions()
	const {
		set: setCommentOptions,
		//  activeCommentId
	} = useComments()
	const { setSidebar, setResolved } = usePlateStore()

	// const isActive = activeCommentId
	// 	? false
	// 	: activeSuggestionId === leaf.suggestionId && isLastLeaf(leaf)

	return (
		<PlateLeaf
			{...props}
			id={`suggestion-leaf-${leaf.suggestionId}`}
			className={cn(
				'text-fm-tag-emerald relative bg-transparent hover:bg-transparent',
				leaf.suggestionDeletion &&
					'text-fm-primary decoration-fm-emerald-300 border-fm-emerald-200 border-2 border-x-0 border-y line-through',
				className
			)}
			onClick={() => {
				setCommentOptions({ activeCommentId: null })
				set('activeSuggestionId', leaf.suggestionId || '')
				setSidebar(ESidebar.COMMENTS)
				setResolved(false)
			}}
			nodeProps={{ ...nodeProps }}
		>
			{/* {isActive && (
				<div className="absolute right-0 bottom-0 z-50 flex translate-x-1/2 translate-y-full gap-2 p-1">
					<Button
						variant="outline"
						size="sm"
						tooltip="Accept"
						onClick={(e) => {
							e.stopPropagation()
							suggestionAction(SuggestionActions.ACCEPT)
						}}
					>
						<Check size={16} />
					</Button>
					<Button
						variant="outline"
						tooltip="Reject"
						size="sm"
						onClick={(e) => {
							e.stopPropagation()
							suggestionAction(SuggestionActions.REJECT)
						}}
					>
						<X size={16} />
					</Button>
				</div>
			)} */}

			{children}
		</PlateLeaf>
	)
}

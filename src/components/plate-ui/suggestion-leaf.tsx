/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React from 'react'
import { SuggestionActions } from '@/constants/editor-constants'
import useComments from '@/hooks/plate/use-comments'
import useSuggestions from '@/hooks/plate/use-suggestions'
import usePlateStore from '@/store/plate-store'
import { PlateLeaf, PlateLeafProps } from '@udecode/plate-common/react'
import { TSuggestionText } from '@udecode/plate-suggestion'
import { Check, X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils/helpers'

import { ESidebar } from '@/types/plate-types'

export default function SuggestionLeaf({
	className,
	...props
}: PlateLeafProps<TSuggestionText>) {
	const { children, leaf, nodeProps } = props
	const { activeSuggestionId, set, suggestionAction, isLastLeaf } =
		useSuggestions()
	const { set: setCommentOptions, activeCommentId } = useComments()
	const { setSidebar, setResolved } = usePlateStore()

	const isActive = activeCommentId
		? false
		: activeSuggestionId === leaf.suggestionId && isLastLeaf(leaf)

	return (
		<PlateLeaf
			{...props}
			id={`suggestion-leaf-${leaf.suggestionId}`}
			className={cn(
				'relative border-b-2 border-b-green-800/20 bg-green-600/40 hover:bg-green-600/80',
				leaf.suggestionDeletion && 'italic line-through',
				isActive && 'bg-green-600/80',
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
			{isActive && (
				<div className="absolute bottom-0 right-0 z-50 flex translate-x-1/2 translate-y-full gap-2 p-1">
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
			)}

			{children}
		</PlateLeaf>
	)
}

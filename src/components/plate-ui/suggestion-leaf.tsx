/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React from 'react'
import { SuggestionActions } from '@/constants/editor-constants'
import useSuggestions from '@/hooks/plate/use-suggestions'
import { PlateLeaf, PlateLeafProps } from '@udecode/plate-common/react'
import { TSuggestionText } from '@udecode/plate-suggestion'
import { Check, X } from 'lucide-react'

import { cn } from '@/lib/utils'

import { Button } from '../ui/button'

export default function SuggestionLeaf({
	className,
	...props
}: PlateLeafProps<TSuggestionText>) {
	const { children, leaf, nodeProps } = props
	const {
		activeSuggestionId,
		set,
		suggestionAction,
		activeSuggestionDescription,
	} = useSuggestions()

	const isActive =
		activeSuggestionId === leaf.suggestionId &&
		!(
			activeSuggestionDescription.type === 'replacement' &&
			leaf.suggestionDeletion
		)

	return (
		<PlateLeaf
			{...props}
			className={cn(
				'relative bg-green-400/50',
				leaf.suggestionDeletion && 'bg-green-400/20 italic line-through',
				className
			)}
			onClick={() => set('activeSuggestionId', leaf.suggestionId || '')}
			nodeProps={{ ...nodeProps }}
		>
			{isActive && (
				<div className="absolute bottom-0 left-0 flex translate-y-full gap-2 p-1">
					<Button
						variant="outline"
						size="sm"
						onClick={(e) => {
							e.stopPropagation()
							suggestionAction(SuggestionActions.ACCEPT)
						}}
					>
						<Check size={16} />
					</Button>
					<Button
						variant="outline"
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

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React from 'react'
import {
	SuggestionActions,
	SuggestionTypes,
} from '@/constants/editor-constants'
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
	const {
		activeSuggestionId,
		set,
		suggestionAction,
		activeSuggestionDescription,
	} = useSuggestions()
	const { setSidebar } = usePlateStore()

	const isActive =
		activeSuggestionId === leaf.suggestionId &&
		!(
			activeSuggestionDescription?.type &&
			activeSuggestionDescription.type === SuggestionTypes.REPLACEMENT &&
			leaf.suggestionDeletion
		)

	return (
		<PlateLeaf
			{...props}
			id={`suggestion-leaf-${leaf.suggestionId}`}
			className={cn(
				'relative bg-green-400/20',
				leaf.suggestionDeletion && 'bg-green-400/20 italic line-through',
				isActive && 'bg-green-400/50',
				className
			)}
			onClick={() => {
				set('activeSuggestionId', leaf.suggestionId || '')
				setSidebar(ESidebar.COMMENTS)
			}}
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

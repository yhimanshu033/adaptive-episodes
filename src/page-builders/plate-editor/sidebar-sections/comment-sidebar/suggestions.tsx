import React, { useEffect, useRef } from 'react'
import {
	SuggestionActions,
	SuggestionTypes,
	SuggestionTypesMap,
} from '@/constants/editor-constants'
import { roleToData } from '@/constants/global-constants'
import useComments from '@/hooks/plate/use-comments'
import useSuggestions from '@/hooks/plate/use-suggestions'
import { useEditorPlugin } from '@udecode/plate-common/react'
import { TSuggestionDescription } from '@udecode/plate-suggestion'
import { SuggestionPlugin } from '@udecode/plate-suggestion/react'

import { Icons } from '@/components/icons'
import { SuggestionAvatar } from '@/components/plate-ui/suggestion-avatar'
import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils/helpers'

import { PlateUser } from '@/types/plate-types'

const SuggestionBlock = ({
	description,
}: {
	description: TSuggestionDescription
}) => {
	const { useOption } = useEditorPlugin(SuggestionPlugin)
	const { activeCommentId, set: setCommentOption } = useComments()
	const user = useOption('suggestionUserById', description?.userId) as
		| PlateUser
		| undefined

	const { suggestionAction, activeSuggestionId, set } = useSuggestions()
	const ref = useRef<HTMLDivElement>(null)

	const isActive = !activeCommentId
		? description.suggestionId === activeSuggestionId
		: null

	let suggestedText: string = ''

	if (description?.type === SuggestionTypes.INSERTION) {
		suggestedText = `"${description.insertedText}"`
	} else if (description?.type === SuggestionTypes.DELETION) {
		suggestedText = `"${description.deletedText}"`
	} else {
		suggestedText = `"${description.deletedText}" with "${description.insertedText}"`
	}

	useEffect(() => {
		if (ref.current && isActive) {
			ref.current.scrollIntoView({
				behavior: 'smooth',
				block: 'nearest',
			})
		}
	}, [isActive])

	const userTitle = user ? roleToData[user?.role]?.title : ''

	if (!user) {
		return null
	}

	return (
		<div
			ref={ref}
			className={cn(
				'cursor-pointer p-2',
				isActive ? 'bg-background/90 border-l-2' : 'hover:bg-background/30'
			)}
			onClick={() => {
				setCommentOption({ activeCommentId: null })
				set('activeSuggestionId', description.suggestionId)
				const elem = document.getElementById(
					'suggestion-leaf-' + description.suggestionId
				)
				if (!elem) {
					return
				}
				elem?.scrollIntoView({ block: 'center', behavior: 'smooth' })
			}}
		>
			<div className="relative flex items-center gap-2">
				<SuggestionAvatar user={user} />
				<h4 className="text-sm leading-none font-semibold">{user?.name}</h4>
				{userTitle && (
					<Badge
						variant="outline"
						className="bg-muted text-xxs text-muted-foreground leading-none"
					>
						{userTitle}
					</Badge>
				)}
				<div
					title="Accept Suggestion"
					className={cn(
						buttonVariants({ variant: 'ghost' }),
						'text-muted-foreground ml-auto h-6 p-1'
					)}
					onClick={() =>
						suggestionAction(SuggestionActions.ACCEPT, description)
					}
				>
					<Icons.check className="size-4" />
				</div>
				<div
					title="Reject Suggestion"
					className={cn(
						buttonVariants({ variant: 'ghost' }),
						'text-muted-foreground h-6 p-1'
					)}
					onClick={() =>
						suggestionAction(SuggestionActions.REJECT, description)
					}
				>
					<Icons.clear className="size-4" />
				</div>
			</div>
			<div className="pl-7">
				<span className="text-xs font-bold">
					{SuggestionTypesMap[description.type]} :{' '}
				</span>
				<span className="text-xs italic">{suggestedText} </span>
			</div>
		</div>
	)
}

export default SuggestionBlock

import React, { useEffect, useRef } from 'react'
import {
	SuggestionActions,
	SuggestionTypes,
	SuggestionTypesMap,
} from '@/constants/editor-constants'
import { roleToData } from '@/constants/global-constants'
import useComments from '@/hooks/plate/use-comments'
import useSuggestions from '@/hooks/plate/use-suggestions'
import { CrossIcon } from '@/icons/cross-icon'
import { TickIcon } from '@/icons/tick-icon'
import { useEditorPlugin } from '@udecode/plate-common/react'
import { TSuggestionDescription } from '@udecode/plate-suggestion'
import { SuggestionPlugin } from '@udecode/plate-suggestion/react'

import Badge from '@/components/aural-ui/badge'
import { Button } from '@/components/aural-ui/button'
import { If } from '@/components/aural-ui/if-else'
import { Typography } from '@/components/aural-ui/typography'
import { SuggestionAvatar } from '@/components/plate-ui/suggestion-avatar'
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
				'border-fm-divider-tertiary rounded-xs border bg-transparent p-4',
				{ 'border-fm-divider-secondary bg-fm-divider-secondary/15': isActive }
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
			<div className="space-y-3">
				<div className="relative flex items-center gap-2">
					<div className="flex items-center gap-2">
						<SuggestionAvatar user={user} />
						<div className="flex flex-col">
							<div className="flex gap-2">
								<Typography color="primary" variant="body-small">
									{user?.name}
								</Typography>
								<If condition={!!userTitle}>
									<Badge size="xs">{userTitle}</Badge>
								</If>
							</div>
						</div>
					</div>
				</div>
				<div>
					<Typography
						as="span"
						color="primary"
						variant="body-small"
						transform="uppercase"
					>
						{SuggestionTypesMap[description.type]} :{' '}
					</Typography>
					<Typography
						as="span"
						className="break-words whitespace-pre-wrap"
						color="tertiary"
						variant="body-small"
					>
						{suggestedText}
					</Typography>
				</div>
				<div className="item-center flex gap-2">
					<Button
						variant="outline"
						onClick={() =>
							suggestionAction(SuggestionActions.REJECT, description)
						}
						className="w-full"
						innerClassName="h-9 border-fm-divider-secondary text-fm-sm"
						leftIcon={<CrossIcon className="size-3 stroke-2" />}
					>
						Reject
					</Button>
					<Button
						variant="outline"
						onClick={() =>
							suggestionAction(SuggestionActions.ACCEPT, description)
						}
						leftIcon={<TickIcon className="size-4" />}
						className="w-full"
						innerClassName="h-9 border-fm-divider-secondary text-fm-sm"
					>
						Accept
					</Button>
				</div>
			</div>
		</div>
	)
}

export default SuggestionBlock

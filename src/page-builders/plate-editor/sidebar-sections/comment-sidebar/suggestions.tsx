import React from 'react'
import {
	SuggestionActions,
	SuggestionTypes,
	SuggestionTypesMap,
} from '@/constants/editor-constants'
import useSuggestions from '@/hooks/plate/use-suggestions'
import { useEditorPlugin, useEditorState } from '@udecode/plate-common/react'
import { TSuggestionDescription } from '@udecode/plate-suggestion'
import { SuggestionPlugin } from '@udecode/plate-suggestion/react'

import { Icons } from '@/components/icons'
import { SuggestionAvatar } from '@/components/plate-ui/suggestion-avatar'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils/helpers'

const SuggestionBlock = ({
	description,
}: {
	description: TSuggestionDescription
}) => {
	const { useOption } = useEditorPlugin(SuggestionPlugin)
	const user = useOption('suggestionUserById', description.userId)
	const { suggestionAction } = useSuggestions()

	let suggestedText: string = ''

	if (description.type === SuggestionTypes.INSERTION) {
		suggestedText = `"${description.insertedText}"`
	} else if (description.type === SuggestionTypes.DELETION) {
		suggestedText = `"${description.deletedText}"`
	} else {
		suggestedText = `"${description.deletedText}" with "${description.insertedText}"`
	}

	return (
		<div className="p-2">
			<div className="relative flex items-center gap-2">
				<SuggestionAvatar user={user} />
				<h4 className="text-sm font-semibold leading-none">{user?.name}</h4>
				<div
					title="Accept Suggestion"
					className={cn(
						buttonVariants({ variant: 'ghost' }),
						'ml-auto h-6 p-1 text-muted-foreground'
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
						'h-6 p-1 text-muted-foreground'
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

const Suggestions = () => {
	const editor = useEditorState()
	const { getAllSuggestionDescriptions } = useSuggestions()

	const descriptions = getAllSuggestionDescriptions(editor)

	return descriptions.map((description) => (
		<SuggestionBlock key={description.suggestionId} description={description} />
	))
}

export default Suggestions

import React from 'react'
import {
	TStoryDataKey,
	TStoryIdeaDataState,
	TStoryIdeaDataStateItem,
} from '@/page-builders/episodes/outliner-questionnaire/lib/types'
import StoryIdeaCard from '@/page-builders/episodes/outliner-questionnaire/story-idea-card'

import { cn } from '@/lib/aural-ui/utils'

interface StoryIdeaUIProps {
	className?: string
	disabled?: boolean
	handleChangeStoryDataStateField?: (data: {
		data: Partial<TStoryIdeaDataStateItem>
		field: TStoryDataKey
		idx: number
	}) => void
	idx: number
	storyIdeaState?: TStoryIdeaDataState
}
// t l s m w K tone na the
export default function StoryIdeaUI({ className, ...props }: StoryIdeaUIProps) {
	return (
		<div className={cn('space-y-4 px-4 pb-4', className)}>
			<StoryIdeaCard field="title" {...props} />
			<StoryIdeaCard field="logline" {...props} />
			<StoryIdeaCard field="synopsis" {...props} />
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
				<StoryIdeaCard field="main_character" {...props} />
				<StoryIdeaCard field="world" {...props} />
			</div>
			<StoryIdeaCard field="key_relationships" {...props} />
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
				<StoryIdeaCard field="tone_and_style" {...props} />
				<StoryIdeaCard field="narrative_journey" {...props} />
			</div>
			<StoryIdeaCard field="themes" {...props} />
		</div>
	)
}

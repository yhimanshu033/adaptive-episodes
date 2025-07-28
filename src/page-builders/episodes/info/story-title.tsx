import React from 'react'
import { Edit } from 'lucide-react'

import EditableText, { EditableTextProps } from '@/components/editable-text'
import useEpisodeTableContext from '@/providers/episode-table-provider'
import { cn } from '@/lib/utils/helpers'

const StoryTitle = ({
	textClass = '',
	...props
}: Partial<EditableTextProps>) => {
	const { initialStoryData: storyData } = useEpisodeTableContext()

	const updateTitle = (author: string) => {
		if (storyData?.author === author) {
			return
		}
		// call mutation
	}

	return (
		<EditableText
			{...props}
			key={storyData?.project_title}
			text={storyData?.project_title || ''}
			textClass={cn('text-3xl font-bold', textClass)}
			onComplete={updateTitle}
			icon={Edit}
		/>
	)
}

export default StoryTitle

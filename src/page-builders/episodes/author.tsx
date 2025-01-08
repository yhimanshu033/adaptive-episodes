import React from 'react'
import { useParams } from 'next/navigation'
import useStoryUploadHook from '@/hooks/mutation/use-story-upload-hook'
import { useStoriesData } from '@/hooks/query/use-story-data'

import EditableText from '@/components/editable-text'

const AuthorTitle = () => {
	const { id } = useParams()
	const { data } = useStoriesData()

	const storyData = data?.find((story) => story.id === parseInt(id as string))
	const { storyUpdateMutation } = useStoryUploadHook()

	const updateAuthor = (author: string) => {
		if (storyData?.author === author) return
		storyUpdateMutation.mutate({
			author,
		})
	}

	return (
		<div className="flex items-center gap-0.5 pl-1 text-xs">
			{storyData?.author ? 'by' : ''}
			<EditableText
				key={storyData?.author}
				text={storyData?.author || ''}
				inputClass="p-1 h-5 ml-1 text-xs"
				btnClass="size-5"
				isEditable={true}
				onComplete={updateAuthor}
			/>
		</div>
	)
}

export default AuthorTitle

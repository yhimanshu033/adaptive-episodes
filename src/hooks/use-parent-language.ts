import { useMemo } from 'react'
import { useParams } from 'next/navigation'
import { useStoriesData } from '@/hooks/query/use-story-data'

import { ELanguage } from '@/types/common'

export default function useParentLanguage() {
	const { data } = useStoriesData()
	const { id } = useParams()

	const initialStoryData = useMemo(
		() => data?.find((story) => story.id === parseInt(id as string)),
		[data, id]
	)

	return initialStoryData?.parent_language || ELanguage.GERMAN_ORIGINAL
}

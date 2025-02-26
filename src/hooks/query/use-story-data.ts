'use client'

import { STORIES_QUERY_KEY } from '@/constants/query-constants'
import { getStories } from '@/server-action/story-action'
import { useQuery } from '@tanstack/react-query'

export const useStoriesData = () => {
	const query = useQuery({
		queryKey: [STORIES_QUERY_KEY],
		queryFn: () => getStories(),
	})
	return query
}

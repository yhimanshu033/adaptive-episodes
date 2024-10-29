'use client'

import { getStories } from '@/server-action/story-action'
import { useQuery } from '@tanstack/react-query'

export const useStoriesData = () => {
	const query = useQuery({
		queryKey: ['stories'],
		queryFn: () => getStories(),
		refetchOnMount: false,
		refetchOnWindowFocus: false,
	})
	return query
}

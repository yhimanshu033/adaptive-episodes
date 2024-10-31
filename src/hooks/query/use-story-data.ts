'use client'

import { getStories } from '@/server-action/story-action'
import { useQuery } from '@tanstack/react-query'

const useStoryData = () => {
	const query = useQuery({
		queryKey: ['story'],
		queryFn: () => getStories(),
		refetchOnMount: false,
		refetchOnWindowFocus: false,
	})
	return query
}

export default useStoryData

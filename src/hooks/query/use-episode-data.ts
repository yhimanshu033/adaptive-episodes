'use client'

import { getEpisodes } from '@/server-action/episode-action'
import { useInfiniteQuery } from '@tanstack/react-query'

const useEpisodeData = (story: string) => {
	const query = useInfiniteQuery({
		queryKey: [story, 'episodes'],
		initialPageParam: 1,
		queryFn: ({ pageParam }) => getEpisodes(story, pageParam),
		getNextPageParam: (lastPage, allPages) => {
			if (lastPage?.hasNext) {
				return allPages.length + 1
			}
			return null
		},
	})
	return query
}

export default useEpisodeData

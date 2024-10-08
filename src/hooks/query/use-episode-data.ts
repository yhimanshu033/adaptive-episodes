'use client'

import { getEpisodes } from '@/server-action/episode-action'
import { keepPreviousData, useQuery } from '@tanstack/react-query'

const useEpisodeData = (
	story: string,
	page?: number,
	episodeFilter?: string
) => {
	const query = useQuery({
		queryKey: [story, 'episodes', page, episodeFilter],
		queryFn: () => getEpisodes(story, page, episodeFilter),
		placeholderData: keepPreviousData,
	})
	return query
}

export default useEpisodeData

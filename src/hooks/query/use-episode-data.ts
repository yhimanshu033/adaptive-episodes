'use client'

import { useParams } from 'next/navigation'
import { getEpisodes } from '@/server-action/episode-action'
import { keepPreviousData, useQuery } from '@tanstack/react-query'

const useEpisodeData = (page?: number, episodeFilter?: string) => {
	const { id } = useParams()
	const query = useQuery({
		queryKey: [id, 'episodes', page, episodeFilter],
		queryFn: () => getEpisodes(id as string, page, episodeFilter),
		placeholderData: keepPreviousData,
	})
	return query
}

export default useEpisodeData

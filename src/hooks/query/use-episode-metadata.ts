'use client'

import { useParams } from 'next/navigation'
import { getMetadata } from '@/server-action/episode-action'
import { useQuery } from '@tanstack/react-query'

const useEpisodeMetadata = (start: string, end: string) => {
	const { id, episodeId }: { episodeId: string; id: string } = useParams()
	const query = useQuery({
		queryKey: ['metadata', id, episodeId, start, end],
		queryFn: () => getMetadata(id, episodeId, start, end),
		enabled: false,
		refetchOnMount: false,
		refetchOnWindowFocus: false,
	})
	return query
}

export default useEpisodeMetadata

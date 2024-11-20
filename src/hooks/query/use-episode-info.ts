'use client'

import { useParams } from 'next/navigation'
import { getEpisodeDetails } from '@/server-action/episode-action'
import { useQuery } from '@tanstack/react-query'

export const useEpisodeInfo = () => {
	const { episodeId, id }: { episodeId: string; id: string } = useParams()
	const query = useQuery({
		queryKey: ['info', episodeId, id],
		queryFn: () => getEpisodeDetails(parseInt(id), parseInt(episodeId)),
		gcTime: 0,
	})

	return query
}

export default useEpisodeInfo

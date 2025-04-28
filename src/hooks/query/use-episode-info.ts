'use client'

import { useParams } from 'next/navigation'
import { EPISODE_INFO_QUERY_KEY } from '@/constants/query-constants'
import { getEpisodeDetails } from '@/server-action/episode-action'
import { useQuery } from '@tanstack/react-query'

import useEpisodeId from '@/providers/episode-id-provider'

export const useEpisodeInfo = () => {
	const episodeId = useEpisodeId()
	const { id }: { id: string } = useParams()

	const query = useQuery({
		queryKey: [EPISODE_INFO_QUERY_KEY, episodeId, id],
		queryFn: () => getEpisodeDetails(parseInt(id), episodeId),
		refetchOnMount: false,
		refetchOnReconnect: false,
		refetchOnWindowFocus: false,
		staleTime: 0,
		gcTime: 0,
	})

	return query
}

export default useEpisodeInfo

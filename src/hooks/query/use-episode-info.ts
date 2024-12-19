'use client'

import { useParams } from 'next/navigation'
import { getEpisodeDetails } from '@/server-action/episode-action'
import { useQuery } from '@tanstack/react-query'

import useEpisodeId from '@/providers/episode-id-provider'

export const useEpisodeInfo = (epId?: number) => {
	const episodeId = useEpisodeId()
	const { id }: { id: string } = useParams()
	const query = useQuery({
		queryKey: ['info', epId || episodeId, id],
		queryFn: () => getEpisodeDetails(parseInt(id), epId || episodeId),
		refetchOnMount: false,
		refetchOnReconnect: false,
		refetchOnWindowFocus: false,
	})

	return query
}

export default useEpisodeInfo

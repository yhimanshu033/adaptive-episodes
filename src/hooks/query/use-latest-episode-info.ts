'use client'

import { useParams } from 'next/navigation'
import { EPISODE_LATEST_INFO_QUERY_KEY } from '@/constants/query-constants'
import { getLatestEpisodeDetails } from '@/server-action/episode-action'
import { useQuery } from '@tanstack/react-query'

import useEpisodeId from '@/providers/episode-id-provider'

export const useLatestEpisodeInfo = ({
	isOriginal,
}: {
	isOriginal: boolean
}) => {
	const episodeId = useEpisodeId()
	const { id }: { id: string } = useParams()

	const query = useQuery({
		queryKey: [EPISODE_LATEST_INFO_QUERY_KEY, episodeId, id, isOriginal],
		queryFn: () => getLatestEpisodeDetails(parseInt(id), isOriginal, episodeId),
		refetchOnMount: false,
		refetchOnReconnect: false,
		refetchOnWindowFocus: false,
		staleTime: 0,
		gcTime: 0,
	})

	return query
}

export default useLatestEpisodeInfo

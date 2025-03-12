'use client'

import { EPISODE_BASE_CONTENT_QUERY_KEY } from '@/constants/query-constants'
import { getEpisodeContent } from '@/server-action/content-action'
import { useQuery } from '@tanstack/react-query'

import useEpisodeId from '@/providers/episode-id-provider'

import { BASE_STATUS } from '@/types/common'

export const useBaseData = () => {
	const episodeId = useEpisodeId()

	const query = useQuery({
		queryKey: [EPISODE_BASE_CONTENT_QUERY_KEY, episodeId, BASE_STATUS],
		queryFn: () => getEpisodeContent(Number(episodeId)),
		refetchOnMount: false,
		refetchOnReconnect: false,
		refetchOnWindowFocus: false,
		staleTime: Infinity,
	})

	return query
}

'use client'

import { useParams } from 'next/navigation'
import { EPISODE_PREV_INFO_QUERY_KEY } from '@/constants/query-constants'
import useEpisodeContent from '@/hooks/query/use-episode-content'
import { getEpisodeDetails } from '@/server-action/episode-action'
import { useQuery } from '@tanstack/react-query'

export const usePreviousEpisodeInfo = () => {
	const { id }: { id: string } = useParams()
	const { data } = useEpisodeContent()
	const episodeId = data?.previous_parent_id || 0

	const query = useQuery({
		queryKey: [EPISODE_PREV_INFO_QUERY_KEY, episodeId, id],
		queryFn: () => getEpisodeDetails(parseInt(id), episodeId),
		refetchOnMount: false,
		refetchOnReconnect: false,
		refetchOnWindowFocus: false,
		enabled: !!episodeId,
	})

	return { ...query, episodeId }
}

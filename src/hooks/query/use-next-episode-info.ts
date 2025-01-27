'use client'

import { useParams } from 'next/navigation'
import useEpisodeContent from '@/hooks/query/use-episode-content'
import useEpisodeInfo from '@/hooks/query/use-episode-info'
import { getEpisodeDetails } from '@/server-action/episode-action'
import { useQuery } from '@tanstack/react-query'

export const useNextEpisodeInfo = () => {
	const { id }: { id: string } = useParams()
	const { data } = useEpisodeContent()
	const episodeId = data?.next_parent_id || 0

	const query = useQuery({
		queryKey: ['info', episodeId, id],
		queryFn: () => getEpisodeDetails(parseInt(id), episodeId),
		refetchOnMount: false,
		refetchOnReconnect: false,
		refetchOnWindowFocus: false,
		enabled: !!episodeId,
	})

	return { ...query, episodeId }
}

export default useEpisodeInfo

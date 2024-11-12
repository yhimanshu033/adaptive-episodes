'use client'

import { getEpisodeContent } from '@/server-action/content-action'
import { useQuery } from '@tanstack/react-query'

import { getLatestEpisode } from '@/lib/utils'

import useEpisodeInfo from './use-episode-info'

export const useEpisodeContent = () => {
	const { data } = useEpisodeInfo()
	const latestEp = data ? getLatestEpisode(data) : null
	const query = useQuery({
		queryKey: [latestEp?.id, 'content'],
		queryFn: () => getEpisodeContent(latestEp?.id || 0),
		enabled: !!latestEp,
	})

	return query
}

export default useEpisodeContent

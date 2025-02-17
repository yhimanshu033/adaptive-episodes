'use client'

import { EPISODE_CONTENT_QUERY_KEY } from '@/constants/episodes-constants'
import { usePreviousEpisodeInfo } from '@/hooks/query/use-prev-episode-info'
import { getEpisodeContent } from '@/server-action/content-action'
import { useQuery } from '@tanstack/react-query'

import { getSelectedEpisode } from '@/lib/utils/helpers'

export const usePreviousEpisodeContent = () => {
	const { data, episodeId } = usePreviousEpisodeInfo()
	const { episode, latestStatus } = data
		? getSelectedEpisode(data)
		: { episode: undefined, latestStatus: undefined }

	const queryKey = [
		EPISODE_CONTENT_QUERY_KEY,
		episode ? episode.id : episodeId,
		latestStatus || 'BASE',
	]

	const query = useQuery({
		queryKey,
		queryFn: () => getEpisodeContent(episode?.id || episodeId),
		refetchOnMount: false,
		refetchOnReconnect: false,
		refetchOnWindowFocus: false,
		staleTime: 0,
		enabled: !!episode,
	})
	return { ...query, latestStatus, queryKey }
}

export default usePreviousEpisodeContent

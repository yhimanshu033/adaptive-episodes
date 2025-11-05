'use client'

import { EPISODE_PREV_CONTENT_QUERY_KEY } from '@/constants/query-constants'
import { usePreviousEpisodeInfo } from '@/hooks/query/use-prev-episode-info'
import { getEpisodeContent } from '@/server-action/content-action'
import { getEpisodeDetails } from '@/server-action/episode-action'
import { useQuery } from '@tanstack/react-query'

import { getSelectedEpisode } from '@/lib/utils/helpers'

import { TGetEpisodeResponse } from '@/types/episode-type'

export async function getPrevEpContent(data?: TGetEpisodeResponse | null) {
	const episodeId = data?.previous_parent_id || 0
	const id = data?.chapter?.project || 0
	if (!episodeId) {
		return ''
	}
	const episodeDetails = await getEpisodeDetails(id, episodeId)
	if (!episodeDetails) {
		return ''
	}
	const { episode } = data
		? getSelectedEpisode(episodeDetails)
		: { episode: undefined }

	const prevEp = await getEpisodeContent(episode?.id || episodeId)

	return prevEp?.text || ''
}

export const usePreviousEpisodeContent = () => {
	const { data, episodeId } = usePreviousEpisodeInfo()
	const { episode, latestStatus } = data
		? getSelectedEpisode(data)
		: { episode: undefined, latestStatus: undefined }

	const queryKey = [
		EPISODE_PREV_CONTENT_QUERY_KEY,
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

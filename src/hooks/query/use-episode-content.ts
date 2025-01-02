'use client'

import { getEpisodeContent } from '@/server-action/content-action'
import { useQuery } from '@tanstack/react-query'

import useEpisodeId, {
	useEpisodeContext,
} from '@/providers/episode-id-provider'
import { getSelectedEpisode } from '@/lib/utils'

import useEpisodeInfo from './use-episode-info'

/**
 * Retrieves episode content.
 *
 * @param   selectedStatus?  Optional selected version of the episode.
 *                           Defaults to the latest version if not provided.
 * @returns                  The content of the specified or latest episode version.
 */

export const useEpisodeContent = () => {
	const { selectedStatus } = useEpisodeContext()
	const { data } = useEpisodeInfo()
	const episodeId = useEpisodeId()
	const { episode, latestStatus } = data
		? getSelectedEpisode(data, selectedStatus)
		: { episode: undefined, latestStatus: undefined }
	const queryKey = [
		episode ? episode.id : episodeId,
		'content',
		latestStatus || 'BASE',
	]
	const query = useQuery({
		queryKey,
		queryFn: () => getEpisodeContent(episode?.id || episodeId),
		refetchOnMount: false,
		refetchOnReconnect: false,
		refetchOnWindowFocus: false,
	})
	return { ...query, latestStatus, queryKey }
}

export default useEpisodeContent

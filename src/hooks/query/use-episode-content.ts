'use client'

import { getEpisodeContent } from '@/server-action/content-action'
import { useQuery } from '@tanstack/react-query'

import { getSelectedEpisode } from '@/lib/utils'

import { EStatus } from '@/types/common'

import useEpisodeInfo from './use-episode-info'

/**
 * Retrieves episode content.
 *
 * @param   selectedStatus?  Optional selected version of the episode.
 *                           Defaults to the latest version if not provided.
 * @returns                  The content of the specified or latest episode version.
 */

export const useEpisodeContent = (selectedStatus?: EStatus, epId?: number) => {
	const { data } = useEpisodeInfo(epId)
	const { episode, latestStatus } = data
		? getSelectedEpisode(data, selectedStatus)
		: { episode: undefined, latestStatus: undefined }
	const query = useQuery({
		queryKey: [epId || episode?.id, 'content'],
		queryFn: () => getEpisodeContent(epId || episode?.id || 0),
		enabled: !!episode,
	})
	return { ...query, latestStatus }
}

export default useEpisodeContent

'use client'

import { getEpisodeContent } from '@/server-action/content-action'
import { useQuery } from '@tanstack/react-query'

import { getSelectedEpisode } from '@/lib/utils'

import { EStatus } from '@/types/common'

import useEpisodeInfo from './use-episode-info'

export const useEpisodeContent = (selectedStatus?: EStatus) => {
	const { data } = useEpisodeInfo()
	const { episode, latestStatus } = data
		? getSelectedEpisode(data, selectedStatus)
		: { episode: undefined, latestStatus: undefined }
	const query = useQuery({
		queryKey: [episode?.id, 'content'],
		queryFn: () => getEpisodeContent(episode?.id || 0),
		enabled: !!episode,
	})

	return { ...query, latestStatus }
}

export default useEpisodeContent

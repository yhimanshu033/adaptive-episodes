'use client'

import { EPISODE_CONTENT_QUERY_KEY } from '@/constants/episodes-constants'
import { useNextEpisodeInfo } from '@/hooks/query/use-next-episode-info'
import { getEpisodeContent } from '@/server-action/content-action'
import useEpisodeIdStore from '@/store/episode-id-store'
import { useQuery } from '@tanstack/react-query'
import { useShallow } from 'zustand/react/shallow'

import { getSelectedEpisode } from '@/lib/utils/helpers'

export const useNextEpisodeContent = () => {
	const { store: useEpisodeIdStoreContext } = useEpisodeIdStore()
	const selectedStatus = useEpisodeIdStoreContext(
		useShallow((state) => state.selectedStatus)
	)
	const { data, episodeId } = useNextEpisodeInfo()
	const { episode, latestStatus } = data
		? getSelectedEpisode(data, selectedStatus)
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

export default useNextEpisodeContent

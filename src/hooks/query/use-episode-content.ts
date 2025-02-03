'use client'

import { EPISODE_CONTENT_QUERY_KEY } from '@/constants/episodes-constants'
import useEpisodeInfo from '@/hooks/query/use-episode-info'
import { getEpisodeContent } from '@/server-action/content-action'
import useEpisodeIdStore from '@/store/episode-id-store'
import useEditorExtendedStore from '@/store/extended-store'
import { useQuery } from '@tanstack/react-query'
import { useShallow } from 'zustand/react/shallow'

import useEpisodeId from '@/providers/episode-id-provider'
import { getSelectedEpisode } from '@/lib/utils/helpers'

/**
 * Retrieves episode content.
 *
 * @param   selectedStatus?  Optional selected version of the episode.
 *                           Defaults to the latest version if not provided.
 * @returns                  The content of the specified or latest episode version.
 */

export const useEpisodeContent = () => {
	const { store: useEpisodeIdStoreContext } = useEpisodeIdStore()
	const selectedStatus = useEpisodeIdStoreContext(
		useShallow((state) => state.selectedStatus)
	)
	const { addEpisodeMap } = useEditorExtendedStore()
	const { data } = useEpisodeInfo()
	const episodeId = useEpisodeId()
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
		queryFn: async () => {
			const resp = await getEpisodeContent(episode?.id || episodeId)
			if (resp) addEpisodeMap(episodeId, resp)
			return resp
		},
		refetchOnMount: false,
		refetchOnReconnect: false,
		refetchOnWindowFocus: false,
		enabled: !!episode,
		staleTime: 0,
		gcTime: 0,
	})
	return { ...query, latestStatus, queryKey }
}

export default useEpisodeContent

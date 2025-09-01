'use client'

import { useParams } from 'next/navigation'
import { EPISODE_LATEST_INFO_QUERY_KEY } from '@/constants/query-constants'
import { getLatestEpisodeDetails } from '@/server-action/episode-action'
import { useQuery } from '@tanstack/react-query'

import useEpisodeId from '@/providers/episode-id-provider'

import { ELanguage } from '@/types/common'

export const useLatestEpisodeInfo = ({
	isOriginal,
	language,
}: {
	isOriginal: boolean
	language?: ELanguage
}) => {
	const episodeId = useEpisodeId()
	const { id }: { id: string } = useParams()

	const query = useQuery({
		queryKey: [EPISODE_LATEST_INFO_QUERY_KEY, episodeId, id],
		queryFn: () =>
			getLatestEpisodeDetails(parseInt(id), language, isOriginal, episodeId),
		refetchOnMount: false,
		refetchOnReconnect: false,
		refetchOnWindowFocus: false,
		staleTime: 0,
		gcTime: 0,
	})

	return query
}

export default useLatestEpisodeInfo

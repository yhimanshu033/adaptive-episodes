import React from 'react'
import { API_URLS } from '@/constants/global-constants'
import { DOC_EPISODE_COUNT_QUERY_KEY } from '@/constants/query-constants'
import { BubbleCrossedIcon } from '@/icons/bubble-crossed-icon'
import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'

import { fetchAPI } from '@/lib/fetch-api'

import { TNoParams } from '@/types/common'
import { TGetDocEpisodeCountResponse } from '@/types/episode-type'

export const useDocEpisodeCountData = (file_url: string | null) => {
	const getEpisodeCount = async () => {
		if (!file_url) {
			return
		}
		const res = await fetchAPI<
			TGetDocEpisodeCountResponse,
			TNoParams,
			{ file_url: string }
		>({
			method: 'GET',
			url: API_URLS.GET_DOC_EPISODE_COUNT,
			body: { file_url },
		})
		if (!res.success) {
			toast.error('Failed to get episode count', {
				icon: <BubbleCrossedIcon />,
			})
		}
		return res.data
	}

	const query = useQuery({
		queryKey: [DOC_EPISODE_COUNT_QUERY_KEY, file_url],
		queryFn: () => getEpisodeCount(),
		enabled: !!file_url,
	})

	return query
}

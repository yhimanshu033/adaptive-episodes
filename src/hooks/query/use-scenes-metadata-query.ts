import { useEffect } from 'react'
import { API_URLS } from '@/constants/global-constants'
import { SCENES_METADATA_QUERY_KEY } from '@/constants/query-constants'
import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'

import { fetchAPI } from '@/lib/fetch-api'

import {
	TGetScenesMetadataAPIResponse,
	TGetScenesMetadataQueryParams,
} from '@/types/beatsheet-editor-types'
import { TNoParams } from '@/types/common'

import useEpisodeContent from './use-episode-content'

export const getScenesMetadata = async (id?: number) => {
	const response = await fetchAPI<
		TGetScenesMetadataAPIResponse,
		TNoParams,
		TNoParams,
		TGetScenesMetadataQueryParams
	>({
		url: API_URLS.GET_SCENES_METADATA,
		method: 'GET',
		query: {
			chapter_id: Number(id || null),
		},
	})

	if (!response.success) {
		throw new Error(
			response.error?.message || 'Failed to fetch scenes metadata'
		)
	}

	return response.data
}

export default function useScenesMetadataQuery() {
	const { episode } = useEpisodeContent()

	const query = useQuery({
		queryKey: [SCENES_METADATA_QUERY_KEY, Number(episode?.id)],
		queryFn: () => getScenesMetadata(episode?.id),
	})

	useEffect(() => {
		if (query.error) {
			toast.error('Failed to fetch scenes metadata')
		}
	}, [query.error])

	return query
}

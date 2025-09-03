import { API_URLS } from '@/constants/global-constants'
import { SCENES_METADATA_QUERY_KEY } from '@/constants/query-constants'
import { useQuery } from '@tanstack/react-query'

import useEpisodeId from '@/providers/episode-id-provider'
import { fetchAPI } from '@/lib/fetch-api'

import {
	TGetScenesMetadataAPIResponse,
	TGetScenesMetadataQueryParams,
} from '@/types/beatsheet-editor-types'
import { TNoParams } from '@/types/common'

export default function useScenesMetadataQuery() {
	const episodeId = useEpisodeId()

	const getScenesMetadata = async () => {
		const response = await fetchAPI<
			TGetScenesMetadataAPIResponse,
			TNoParams,
			TNoParams,
			TGetScenesMetadataQueryParams
		>({
			url: API_URLS.GET_SCENES_METADATA,
			method: 'GET',
			query: {
				chapter_id: Number(episodeId),
			},
		})

		return response.data
	}

	const query = useQuery({
		queryKey: [SCENES_METADATA_QUERY_KEY, Number(episodeId)],
		queryFn: () => getScenesMetadata(),
	})

	return query
}

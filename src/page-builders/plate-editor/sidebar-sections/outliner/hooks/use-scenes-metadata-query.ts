import { useEffect } from 'react'
import { API_URLS } from '@/constants/global-constants'
import { OUTLINER_SCENES_METADATA_QUERY_KEY } from '@/constants/query-constants'
import useEpisodeContent from '@/hooks/query/use-episode-content'
import {
	TGetOutlinerScenesMetadataAPIResponse,
	TGetOutlinerScenesMetadataQueryParams,
} from '@/page-builders/plate-editor/sidebar-sections/outliner/lib/types'
import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'

import { fetchAPI } from '@/lib/fetch-api'

import { TNoParams } from '@/types/common'

export default function useOutlinerScenesMetadataQuery() {
	const { episode } = useEpisodeContent()

	const getScenesMetadata = async () => {
		const response = await fetchAPI<
			TGetOutlinerScenesMetadataAPIResponse,
			TNoParams,
			TNoParams,
			TGetOutlinerScenesMetadataQueryParams
		>({
			url: API_URLS.GET_SCENES_METADATA,
			method: 'GET',
			query: {
				chapter_id: Number(episode?.id || null),
			},
		})

		if (!response.success) {
			throw new Error(
				response.error?.message || 'Failed to fetch scenes metadata'
			)
		}

		return response.data
	}

	const query = useQuery({
		queryKey: [OUTLINER_SCENES_METADATA_QUERY_KEY, Number(episode?.id)],
		queryFn: () => getScenesMetadata(),
	})

	useEffect(() => {
		if (query.error) {
			toast.error('Failed to fetch scenes metadata')
		}
	}, [query.error])

	return query
}

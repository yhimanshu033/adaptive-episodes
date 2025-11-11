import { API_URLS } from '@/constants/global-constants'
import { OUTLINER_METADATA_QUERY_KEY } from '@/constants/query-constants'
import useEpisodeContent from '@/hooks/query/use-episode-content'
import {
	TGetOutlinerScenesMetadataAPIResponse,
	TGetOutlinerScenesMetadataQueryParams,
	TSaveOutlinerCachedScenesQueryParams,
} from '@/page-builders/plate-editor/sidebar-sections/outliner/lib/types'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

import { fetchAPI } from '@/lib/fetch-api'

import { TNoParams } from '@/types/common'

export default function useSaveCachedOutlineMutation() {
	const { data: episodeData } = useEpisodeContent()
	async function saveCachedOutline() {
		if (
			isNaN(Number(episodeData?.chapter?.id)) ||
			isNaN(Number(episodeData?.chapter?.project))
		) {
			toast.error('Could not save cached scenes!')
			return
		}
		const resp = await fetchAPI<
			TNoParams,
			TNoParams,
			TNoParams,
			TSaveOutlinerCachedScenesQueryParams
		>({
			method: 'POST',
			url: API_URLS.OUTLINER_SAVE_CACHED_OUTLINE,
			query: {
				project_id: Number(episodeData?.chapter?.project),
				chapter_id: Number(episodeData?.chapter?.id),
			},
		})
		if (resp.success) {
			const scenesResponse = await fetchAPI<
				TGetOutlinerScenesMetadataAPIResponse,
				TNoParams,
				TNoParams,
				TGetOutlinerScenesMetadataQueryParams
			>({
				url: API_URLS.GET_SCENES_METADATA,
				method: 'GET',
				query: {
					chapter_id: Number(episodeData?.chapter.id || null),
				},
			})

			return { scenes: scenesResponse.data?.result }
		} else {
			toast.error('Could not save cached scenes!')
		}
	}

	const mutation = useMutation({
		mutationFn: saveCachedOutline,
		mutationKey: [
			OUTLINER_METADATA_QUERY_KEY,
			episodeData?.chapter?.project,
			episodeData?.chapter?.id,
		],
	})

	return mutation
}

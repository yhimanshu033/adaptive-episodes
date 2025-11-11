import { useSearchParams } from 'next/navigation'
import { API_URLS } from '@/constants/global-constants'
import { OUTLINER_DATA_QUERY_KEY } from '@/constants/query-constants'
import useEpisodeContent from '@/hooks/query/use-episode-content'
import {
	TGetOutlinerMetadataQueryParams,
	TGetOutlinerMetadataResponse,
	TGetOutlinerMetadataUrlParams,
	TGetOutlinerScenesMetadataAPIResponse,
	TGetOutlinerScenesMetadataQueryParams,
	TOutlinerChatGetNewIdeasResponse,
	TOutlinerChatGetNewIdeasUrlParams,
	TOutlinerFetchedData,
} from '@/page-builders/plate-editor/sidebar-sections/outliner/lib/types'
import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'

import { fetchAPI } from '@/lib/fetch-api'

import { TNoParams } from '@/types/common'

export default function useOutlinerData() {
	const { data } = useEpisodeContent()

	// test ugc
	const searchParams = useSearchParams()
	const isUGC = !!searchParams.get('ugc')

	async function getOutlinerData(): Promise<TOutlinerFetchedData> {
		const [metadataResp, scenesResp] = await Promise.all([
			fetchAPI<
				TGetOutlinerMetadataResponse,
				TGetOutlinerMetadataUrlParams,
				TNoParams,
				TGetOutlinerMetadataQueryParams
			>({
				method: 'GET',
				url: API_URLS.GET_OUTLINER_METADATA,
				query: {
					seq_number: data?.chapter?.seq_number || 0,
				},
				urlParams: {
					projectId: data?.chapter?.project || 0,
				},
			}),
			fetchAPI<
				TGetOutlinerScenesMetadataAPIResponse,
				TNoParams,
				TNoParams,
				TGetOutlinerScenesMetadataQueryParams
			>({
				url: API_URLS.GET_SCENES_METADATA,
				method: 'GET',
				query: {
					chapter_id: Number(data?.chapter?.id || null),
				},
			}),
		])

		if (!metadataResp.data?.result) {
			toast.error('Error fetching outliner metadata!')
			throw new Error('Error fetching outliner metadata!')
		}
		metadataResp.data.result.current_episode_summary =
			metadataResp.data.result.current_episode_summary ||
			data?.chapter?.props?.llm_memories?.summary
		if (!metadataResp.data.result.current_episode_summary) {
			const existingNewIdeas = await fetchAPI<
				TOutlinerChatGetNewIdeasResponse,
				TOutlinerChatGetNewIdeasUrlParams
			>({
				method: 'GET',
				url: API_URLS.OUTLINER_NEW_IDEAS,
				urlParams: {
					episodeId: data?.chapter?.id || 0,
				},
			})
			if (existingNewIdeas.data?.result?.new_episode_ideas?.length) {
				return {
					...metadataResp.data.result,
					existingNewIdeas: existingNewIdeas.data.result.new_episode_ideas,
					scenesResponse: scenesResp.data,
				}
			}
		}

		return {
			...metadataResp.data.result,
			scenesResponse: scenesResp.data,
		}
	}

	const query = useQuery({
		queryKey: [
			OUTLINER_DATA_QUERY_KEY,
			data?.chapter?.project,
			data?.chapter?.id,
			isUGC,
		],
		queryFn: getOutlinerData,
		enabled: !!data?.chapter?.seq_number,
	})

	return query
}

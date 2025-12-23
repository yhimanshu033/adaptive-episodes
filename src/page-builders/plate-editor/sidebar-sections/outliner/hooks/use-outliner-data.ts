import { API_URLS } from '@/constants/global-constants'
import { OUTLINER_DATA_QUERY_KEY } from '@/constants/query-constants'
import useEpisodeContent from '@/hooks/query/use-episode-content'
import { isMetadataIncomplete } from '@/page-builders/plate-editor/sidebar-sections/outliner/lib/fns'
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
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

import { doPoll } from '@/lib/do-poll'
import { fetchAPI } from '@/lib/fetch-api'

import { TNoParams } from '@/types/common'

export default function useOutlinerData() {
	const { data } = useEpisodeContent()

	async function getOutlinerData(): Promise<TOutlinerFetchedData | undefined> {
		if (!data?.chapter.id) {
			return
		}
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
					chapterId: data?.chapter?.id || 0,
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

		if (isMetadataIncomplete(metadataResp.data)) {
			const polledResp = await doPoll<
				TNoParams,
				TGetOutlinerMetadataResponse,
				TGetOutlinerMetadataUrlParams,
				TGetOutlinerMetadataQueryParams
			>({
				method: 'GET',
				url: API_URLS.GET_OUTLINER_METADATA,
				query: {
					seq_number: data?.chapter?.seq_number || 0,
				},
				urlParams: {
					projectId: data?.chapter?.project || 0,
					chapterId: data?.chapter?.id || 0,
				},
				delay: 10 * 1000, // 10 seconds
				stop: (data) => {
					return !isMetadataIncomplete(data?.data)
				},
			})
			metadataResp.data.result = {
				...metadataResp.data.result,
				...(polledResp?.data?.result || {}),
			}
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

	const query = useMutation({
		mutationKey: [
			OUTLINER_DATA_QUERY_KEY,
			data?.chapter?.project,
			data?.chapter?.id,
		],
		mutationFn: getOutlinerData,
	})

	return query
}

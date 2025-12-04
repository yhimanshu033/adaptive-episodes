import { API_URLS } from '@/constants/global-constants'
import { useUGCPublishMutation } from '@/hooks/mutation/use-ugc-action-mutations'
import useEpisodeContent from '@/hooks/query/use-episode-content'
import {
	TGetOutlinerScenesMetadataAPIResponse,
	TGetOutlinerScenesMetadataQueryParams,
} from '@/page-builders/plate-editor/sidebar-sections/outliner/lib/types'
import { useMutation } from '@tanstack/react-query'

import { doPoll } from '@/lib/do-poll'

import { TNoParams } from '@/types/common'

export default function useCurrentEpPublish() {
	const { mutateAsync: publishEpisode } = useUGCPublishMutation()
	const { data: episodeData } = useEpisodeContent()

	async function publishCurrentEpisode() {
		// start NWM only if not already running or has ran
		if (!episodeData?.chapter) {
			return
		}
		if (
			!episodeData?.chapter?.props ||
			!('nwm_running' in episodeData.chapter.props)
		) {
			await publishEpisode()
		}

		const resp = await doPoll<
			TNoParams,
			TGetOutlinerScenesMetadataAPIResponse,
			TNoParams,
			TGetOutlinerScenesMetadataQueryParams
		>({
			method: 'GET',
			url: API_URLS.GET_SCENES_METADATA,
			query: {
				chapter_id: Number(episodeData?.chapter?.id || null),
			},
			delay: 20 * 1000, // 20 seconds
			stop: (data) => {
				return !!data?.data?.result?.length
			},
			startDelay: 1 * 60 * 1000, // 1 minute
		})

		return resp?.data
	}

	const mutation = useMutation({
		mutationFn: publishCurrentEpisode,
	})

	return mutation
}

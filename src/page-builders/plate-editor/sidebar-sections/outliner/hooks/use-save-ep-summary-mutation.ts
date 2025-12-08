import { API_URLS } from '@/constants/global-constants'
import useEpisodeContent from '@/hooks/query/use-episode-content'
import {
	TSaveEpisodeSummaryBody,
	TSaveEpisodeSummaryUrlParams,
} from '@/page-builders/plate-editor/sidebar-sections/outliner/lib/types'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

import { fetchAPI } from '@/lib/fetch-api'

import { TNoParams } from '@/types/common'

const SAVE_EPISODE_SUMMARY_MUTATION_KEY = 'save-episode-summary'

export default function useSaveEpisodeSummaryMutation() {
	const { data } = useEpisodeContent()

	async function saveEpisodeSummary(body: TSaveEpisodeSummaryBody) {
		if (isNaN(Number(data?.chapter?.id))) {
			toast.error('Could not save summary')
			return
		}

		return fetchAPI<
			TNoParams,
			TSaveEpisodeSummaryUrlParams,
			TSaveEpisodeSummaryBody
		>({
			method: 'PUT',
			url: API_URLS.SAVE_EPISODE_SUMMARY,
			body,
			urlParams: {
				episodeId: data?.chapter.id || 0,
			},
		})
	}

	const mutation = useMutation({
		mutationFn: saveEpisodeSummary,
		mutationKey: [SAVE_EPISODE_SUMMARY_MUTATION_KEY, data?.chapter.id],
	})

	return mutation
}

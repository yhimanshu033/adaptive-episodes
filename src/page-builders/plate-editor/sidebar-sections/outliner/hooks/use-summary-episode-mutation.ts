import { API_URLS } from '@/constants/global-constants'
import { SUMMARY_TO_EPISODE_MUTATION_KEY } from '@/constants/query-constants'
import useSocketStreaming from '@/hooks/use-socket-streaming'
import {
	TGenerateEpisodeFromSummaryBody,
	TGenerateEpisodeFromSummaryResponse,
} from '@/page-builders/plate-editor/sidebar-sections/outliner/lib/types'
import { useMutation } from '@tanstack/react-query'

export default function useSummaryEpisodeMutation() {
	const { startTask } = useSocketStreaming()
	async function sendSummaryEpisodeGeneration(
		body: TGenerateEpisodeFromSummaryBody
	) {
		const taskId = await startTask<
			TGenerateEpisodeFromSummaryBody,
			TGenerateEpisodeFromSummaryResponse
		>({
			method: 'POST',
			url: API_URLS.OUTLINER_SUMMARY_EPISODE,
			body,
			noCache: true,
		})
		return taskId
	}

	const mutation = useMutation({
		mutationFn: sendSummaryEpisodeGeneration,
		mutationKey: [SUMMARY_TO_EPISODE_MUTATION_KEY],
	})

	return mutation
}

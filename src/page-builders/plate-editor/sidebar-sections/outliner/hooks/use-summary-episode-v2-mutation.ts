import { API_URLS } from '@/constants/global-constants'
import { SUMMARY_TO_EPISODE_MUTATION_KEY } from '@/constants/query-constants'
import useSocketStreaming from '@/hooks/use-socket-streaming'
import { TGenerateEpisodeFromSummaryV2Body } from '@/page-builders/plate-editor/sidebar-sections/outliner/lib/types'
import { useMutation } from '@tanstack/react-query'

export default function useSummaryEpisodeV2Mutation() {
	const { startTask } = useSocketStreaming()
	async function sendSummaryEpisodeGeneration(
		body: TGenerateEpisodeFromSummaryV2Body
	) {
		const taskId = await startTask<TGenerateEpisodeFromSummaryV2Body>({
			method: 'POST',
			url: API_URLS.OUTLINER_SUMMARY_EPISODE_V2,
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

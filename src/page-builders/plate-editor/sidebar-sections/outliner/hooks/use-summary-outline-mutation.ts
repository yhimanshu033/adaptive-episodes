import { API_URLS } from '@/constants/global-constants'
import { SUMMARY_TO_OUTLINE_MUTATION_KEY } from '@/constants/query-constants'
import useSocketStreaming from '@/hooks/use-socket-streaming'
import { TOutlinerSummaryOutlineBody } from '@/page-builders/plate-editor/sidebar-sections/outliner/lib/types'
import { useMutation } from '@tanstack/react-query'

export default function useSummaryOutlineMutation() {
	const { startTask } = useSocketStreaming()

	async function sendSummaryOutlineGeneration(
		body: TOutlinerSummaryOutlineBody
	) {
		const taskId = await startTask<TOutlinerSummaryOutlineBody>({
			method: 'POST',
			url: API_URLS.OUTLINER_SUMMARY_OUTLINE,
			body,
			noCache: true,
		})
		return taskId
	}

	const mutation = useMutation({
		mutationFn: sendSummaryOutlineGeneration,
		mutationKey: [SUMMARY_TO_OUTLINE_MUTATION_KEY],
	})

	return mutation
}

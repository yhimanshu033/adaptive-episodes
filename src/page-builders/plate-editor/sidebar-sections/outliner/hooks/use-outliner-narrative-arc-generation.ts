import { API_URLS } from '@/constants/global-constants'
import useSocketStreaming from '@/hooks/use-socket-streaming'
import { TGenerateNarrativeArcPlanBody } from '@/page-builders/plate-editor/sidebar-sections/outliner/lib/types'
import { useMutation } from '@tanstack/react-query'

export default function useOutlinerNarrativeArcGeneration() {
	const { startTask } = useSocketStreaming()

	async function generateNarrativeArcPlan(body: TGenerateNarrativeArcPlanBody) {
		const taskId = await startTask<TGenerateNarrativeArcPlanBody>({
			method: 'POST',
			url: API_URLS.GENERATE_NARRATIVE_ARC_PLAN,
			body,
			noCache: true,
		})

		return taskId
	}

	const mutation = useMutation({
		mutationFn: generateNarrativeArcPlan,
	})

	return mutation
}

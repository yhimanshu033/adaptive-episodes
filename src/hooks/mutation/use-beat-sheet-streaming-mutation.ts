import { useParams } from 'next/navigation'
import { API_URLS } from '@/constants/global-constants'
import { GENERATE_BEATSHEET_MUTATION_KEY } from '@/constants/query-constants'
import useSocketStreaming from '@/hooks/use-socket-streaming'
import { useMutation } from '@tanstack/react-query'

import { TGenerateBeatsheetBody } from '@/types/beatsheet-editor-types'

const useBeatSheetStreamingMutation = () => {
	const { id } = useParams()
	const { startTask } = useSocketStreaming()

	const onGenerateBeatSheetMutation = async ({
		params,
	}: {
		params: TGenerateBeatsheetBody
	}) => {
		const taskId = await startTask<TGenerateBeatsheetBody, { message: string }>(
			{
				method: 'POST',
				url: params.scene_wide_prompt
					? API_URLS.SCENE_PROMPT_GENERATE
					: API_URLS.BEATSHEET_GENERATE,
				body: params,
				noCache: true,
			}
		)
		return taskId
	}

	const generateBeatSheetMutation = useMutation({
		mutationKey: [GENERATE_BEATSHEET_MUTATION_KEY, Number(id)],
		mutationFn: onGenerateBeatSheetMutation,
	})

	return generateBeatSheetMutation
}

export default useBeatSheetStreamingMutation

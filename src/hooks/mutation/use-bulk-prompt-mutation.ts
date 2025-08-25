import { useParams } from 'next/navigation'
import { API_URLS } from '@/constants/global-constants'
import { BULK_EP_PROMPT_MUTATION_KEY } from '@/constants/query-constants'
import useSocketStreaming from '@/hooks/use-socket-streaming'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

import { TSendBulkPromptBody, TSendBulkPromptUrlParams } from '@/types/ai-types'
import { TNoParams } from '@/types/common'

export default function useBulkPromptMutation() {
	const { startTask } = useSocketStreaming()
	const { id } = useParams()

	async function sendBulkPrompt(body: TSendBulkPromptBody) {
		const taskId = await startTask<
			TSendBulkPromptBody,
			TNoParams,
			TSendBulkPromptUrlParams
		>({
			method: 'POST',
			body,
			url: API_URLS.BULK_PROMPT_SEND,
			urlParams: {
				projectId: String(id),
			},
		})
		toast.success('Bulk prompt processing started!')
		return taskId
	}

	const mutation = useMutation({
		mutationFn: sendBulkPrompt,
		mutationKey: [BULK_EP_PROMPT_MUTATION_KEY],
	})

	return mutation
}

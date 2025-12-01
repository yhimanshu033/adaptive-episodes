import { API_URLS } from '@/constants/global-constants'
import useSocketStreaming from '@/hooks/use-socket-streaming'
import { TPostOutlinerQuestionnaireChat } from '@/page-builders/episodes/outliner-questionnaire/lib/types'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

export function useOutlinerQuestionnaireChat() {
	const { startTask } = useSocketStreaming()

	async function sendChat(body: TPostOutlinerQuestionnaireChat) {
		if (!body?.message?.trim()) {
			toast.info('Message sending failed!')
			return
		}
		const taskId = await startTask<TPostOutlinerQuestionnaireChat>({
			method: 'POST',
			url: API_URLS.OUTLINER_QUESTIONNAIRE_CHAT,
			body,
		})

		return taskId
	}

	const mutation = useMutation({
		mutationFn: sendChat,
	})

	return mutation
}

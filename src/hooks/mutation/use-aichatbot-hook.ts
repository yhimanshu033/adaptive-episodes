import { getChatbotResponse } from '@/server-action/ai-action'
import { useMutation } from '@tanstack/react-query'

const useAIChatbotHook = () => {
	const aiChatbotMutation = useMutation({
		mutationKey: ['chatbot'],
		mutationFn: getChatbotResponse,
	})
	return { aiChatbotMutation }
}
export default useAIChatbotHook

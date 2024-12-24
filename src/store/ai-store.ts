import { aiInitialMessage } from '@/constants/ai-constants'

import { useEpisodeContext } from '@/providers/episode-id-provider'

import { AIStoreType, TMessage } from '@/types/ai-types'

function useAIStore() {
	const { useAiStoreContext } = useEpisodeContext()
	const addMessages = (message: TMessage) => {
		useAiStoreContext.setState((state) => {
			return { messages: [...state.messages, message] }
		})
	}

	const updateMessages = (message: TMessage, index: number) => {
		useAiStoreContext.setState((state) => {
			return {
				messages: state.messages.map((msg, i) => (i === index ? message : msg)),
			}
		})
	}

	const popMessage = () => {
		useAiStoreContext.setState((state) => {
			return { messages: state.messages.slice(0, -1) }
		})
	}

	const clearMessages = () => {
		useAiStoreContext.setState({ messages: aiInitialMessage })
	}

	const setResponseValue = (value: AIStoreType['responseValue']) => {
		useAiStoreContext.setState({ responseValue: value })
	}

	const setPrevValue = (value: AIStoreType['prevValue']) => {
		useAiStoreContext.setState({ prevValue: value })
	}

	const setAcceptedValue = (value: AIStoreType['acceptedValue']) => {
		useAiStoreContext.setState({ acceptedValue: value })
	}

	return {
		store: useAiStoreContext,
		addMessages,
		updateMessages,
		popMessage,
		clearMessages,
		setResponseValue,
		setPrevValue,
		setAcceptedValue,
	}
}
export default useAIStore

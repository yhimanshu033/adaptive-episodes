import { aiInitialMessage } from '@/constants/ai-constants'
import { ExplorerModeId } from '@/constants/story-explorer-constants'

import { useEpisodeContext } from '@/providers/episode-id-provider'

import { AIStoreType, ExplorerActionType, TMessage } from '@/types/ai-types'

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

	const setRequestedAction = (action: AIStoreType['requestedAction']) => {
		useAiStoreContext.setState({ requestedAction: action })
	}

	const setActiveExplorerMode = (mode: AIStoreType['activeExplorerMode']) => {
		useAiStoreContext.setState({ activeExplorerMode: mode })
	}

	const setActiveExplorerActions = (
		mode: ExplorerModeId,
		action: ExplorerActionType | string | null
	) => {
		useAiStoreContext.setState((state) => ({
			activeExplorerActions: { ...state.activeExplorerActions, [mode]: action },
		}))
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
		setRequestedAction,
		setActiveExplorerMode,
		setActiveExplorerActions,
	}
}

export default useAIStore

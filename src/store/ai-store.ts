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
		useAiStoreContext.setState({ messages: [] })
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

	const setActiveCommentExampleMap = (
		activeCommentExampleMap: AIStoreType['activeCommentExampleMap']
	) => {
		useAiStoreContext.setState({ activeCommentExampleMap })
	}

	const addActiveCommentExampleMap = ({
		key,
		value,
	}: {
		key: string
		value: string
	}) => {
		useAiStoreContext.setState((state) => ({
			activeCommentExampleMap: {
				...state.activeCommentExampleMap,
				[key]: value,
			},
		}))
	}

	const removeActiveCommentExampleMap = (key: string) => {
		useAiStoreContext.setState((state) => {
			const activeCommentExampleMap = { ...state.activeCommentExampleMap }
			delete activeCommentExampleMap[key]
			return { activeCommentExampleMap }
		})
	}

	const setStoryExplorerConfiguration = (
		storyExplorerConfiguration: AIStoreType['storyExplorerConfiguration']
	) => {
		useAiStoreContext.setState({ storyExplorerConfiguration })
	}

	const setStoryExplorerConfigurationValue = (
		storyExplorerConfigurationKey: keyof AIStoreType['storyExplorerConfiguration'],
		value: boolean
	) => {
		useAiStoreContext.setState((state) => ({
			storyExplorerConfiguration: {
				...state.storyExplorerConfiguration,
				[storyExplorerConfigurationKey]: value,
			},
		}))
	}

	const setInputFocus = (inputFocus: AIStoreType['inputFocus']) => {
		useAiStoreContext.setState({ inputFocus })
	}

	const setFocusConfig = (
		explorerFocusConfig: AIStoreType['explorerFocusConfig']
	) => {
		useAiStoreContext.setState({ explorerFocusConfig })
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
		setActiveCommentExampleMap,
		addActiveCommentExampleMap,
		removeActiveCommentExampleMap,
		setStoryExplorerConfiguration,
		setStoryExplorerConfigurationValue,
		setInputFocus,
		setFocusConfig,
	}
}

export default useAIStore

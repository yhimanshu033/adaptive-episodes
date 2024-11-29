import { aiInitialMessage } from '@/constants/ai-constants'
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

import { AIStoreType } from '@/types/ai-types'

const initialState: AIStoreType = {
	messages: aiInitialMessage,
	responseValue: null,
	prevValue: null,
	acceptedValue: null,
}

const useAIStore = create(devtools(immer(() => initialState)))

export const addMessages = (message: {
	content: string
	role: 'user' | 'assistant'
}) => {
	useAIStore.setState((state) => {
		state.messages.push(message)
	})
}

export const updateMessages = (
	message: {
		content: string
		role: 'user' | 'assistant'
	},
	index: number
) => {
	useAIStore.setState((state) => {
		state.messages[index] = message
	})
}

export const clearMessages = () => {
	useAIStore.setState({ messages: aiInitialMessage })
}

export const setResponseValue = (value: AIStoreType['responseValue']) => {
	useAIStore.setState({ responseValue: value })
}

export const setPrevValue = (value: AIStoreType['prevValue']) => {
	useAIStore.setState({ prevValue: value })
}

export const setAcceptedValue = (value: AIStoreType['acceptedValue']) => {
	useAIStore.setState({ acceptedValue: value })
}
export default useAIStore

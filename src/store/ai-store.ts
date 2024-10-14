import { aiInitialMessage } from '@/constants/ai-constants'
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

import { AIStoreType } from '@/types/ai-types'

const initialState: AIStoreType = {
	messages: aiInitialMessage,
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

export const clearMessages = () => {
	useAIStore.setState({ messages: aiInitialMessage })
}

export default useAIStore

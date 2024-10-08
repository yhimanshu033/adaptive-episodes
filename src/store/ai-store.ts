import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

import { AIStoreType } from '@/types/ai-types'

const initialState: AIStoreType = {
	messages: [],
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

export default useAIStore

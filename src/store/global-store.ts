import { Session } from 'next-auth'
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

import { GlobalStoreState } from '@/types/common'

const initialState: GlobalStoreState = {
	userData: null,
	isFullScreenLoading: false,
}

export const useGlobalStore = create(devtools(immer(() => initialState)))

export const updateUserData = (userData: Session | null) => {
	useGlobalStore.setState((state) => ({ ...state, userData }))
}

export const setFullScreenLoading = (isFullScreenLoading: boolean) => {
	useGlobalStore.setState({ isFullScreenLoading })
}

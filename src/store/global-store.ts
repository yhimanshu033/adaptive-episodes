import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

import { SessionData } from '@/types/admin-types'
import { GlobalStoreState } from '@/types/common'
import { SaveEpisodeParams } from '@/types/episode-type'

const initialState: GlobalStoreState = {
	userData: null,
	isFullScreenLoading: false,
	fullScreenLoadingMessage: '',
	unsavedEpisodeParams: {},
}

export const useGlobalStore = create(devtools(immer(() => initialState)))

export const updateUserData = (userData: SessionData | null) => {
	useGlobalStore.setState((state) => ({ ...state, userData }))
}

export const setFullScreenLoading = (isFullScreenLoading: boolean) => {
	useGlobalStore.setState({ isFullScreenLoading })
}

export const setFullScreenLoadingMessage = (
	fullScreenLoadingMessage: string
) => {
	useGlobalStore.setState({ fullScreenLoadingMessage })
}

export const setUnsavedEpisodeParams = (
	unsavedEpisodeParams: GlobalStoreState['unsavedEpisodeParams']
) => {
	useGlobalStore.setState({ unsavedEpisodeParams })
}

export const addUnsavedEpisodeParams = (
	id: string,
	unsavedEpisodeParam: SaveEpisodeParams
) => {
	useGlobalStore.setState((state) => ({
		...state,
		unsavedEpisodeParams: {
			...state.unsavedEpisodeParams,
			[id]: unsavedEpisodeParam,
		},
	}))
}

export const removeUnsavedEpisodeParams = (id: string) => {
	useGlobalStore.setState((state) => {
		const newUnsavedEpisodeParams = { ...state.unsavedEpisodeParams }
		delete newUnsavedEpisodeParams[id]
		return { ...state, unsavedEpisodeParams: newUnsavedEpisodeParams }
	})
}

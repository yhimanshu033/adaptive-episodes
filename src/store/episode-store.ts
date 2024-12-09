import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

import { EpisodeStoreState } from '@/types/episode-type'

const initialState: EpisodeStoreState = {
	currentPage: 1,
	episodeSearch: '',
}

export const useEpisodeStore = create(devtools(immer(() => initialState)))

export const setCurrentPage = (currentPage: number) => {
	useEpisodeStore.setState(() => ({ currentPage }))
}

export const setEpisodeSearch = (episodeSearch: string) => {
	useEpisodeStore.setState(() => ({ episodeSearch }))
}

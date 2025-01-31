import { create } from 'zustand'

import { TGetEpisodeResponse } from '@/types/episode-type'

export const extendStore = create<{
	addEpisode: (id: number, episode: TGetEpisodeResponse) => void
	episodeMap: Record<number, TGetEpisodeResponse>
	extended: number[]
	setEpisodeMap: (value: Record<number, TGetEpisodeResponse>) => void
	setExtended: (value: number[]) => void
}>((set) => ({
	extended: [],
	setExtended: (value) => set({ extended: value }),
	episodeMap: {},
	setEpisodeMap: (value) => set({ episodeMap: value }),
	addEpisode: (id, episode) =>
		set((state) => ({ episodeMap: { ...state.episodeMap, [id]: episode } })),
}))

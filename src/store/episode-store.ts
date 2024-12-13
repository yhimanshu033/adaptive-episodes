import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

import { EpisodeStoreState } from '@/types/episode-type'

const initialState: EpisodeStoreState = {
	currentPage: 1,
	episodeSearch: '',
	isDialogOpen: false,
	isInventOpen: false,
	alertInfo: null,
	deleteEpisodeId: null,
	selectedEpisodes: null,
	currentInventIndex: null,
}

export const useEpisodeStore = create(devtools(immer(() => initialState)))

export const setCurrentPage = (currentPage: number) => {
	useEpisodeStore.setState({ currentPage })
}

export const setEpisodeSearch = (episodeSearch: string) => {
	useEpisodeStore.setState(() => ({ episodeSearch }))
}

export const setIsDialogOpen = (isDialogOpen: boolean) => {
	useEpisodeStore.setState({ isDialogOpen })
}

export const setIsInventOpen = (isInventOpen: boolean) => {
	useEpisodeStore.setState({ isInventOpen })
}

export const setAlertInfo = (alertInfo: EpisodeStoreState['alertInfo']) => {
	useEpisodeStore.setState({ alertInfo })
}

export const setSelectedEpisodes = (
	selectedEpisodes: EpisodeStoreState['selectedEpisodes']
) => {
	useEpisodeStore.setState({ selectedEpisodes })
}
export const setDeleteEpisodeId = (
	deleteEpisodeId: EpisodeStoreState['deleteEpisodeId']
) => {
	useEpisodeStore.setState({ deleteEpisodeId })
}

export const setInventIndex = (currentInventIndex: number) => {
	useEpisodeStore.setState({ currentInventIndex })
}

import useEpisodeTableContext from '@/providers/episode-table-provider'

import { EpisodeStoreState } from '@/types/episode-type'

export function useEpisodeStore() {
	const { useEpisodeStoreUtil } = useEpisodeTableContext()

	const setCurrentPage = (currentPage: number) => {
		useEpisodeStoreUtil.setState({ currentPage })
	}

	const setEpisodeSearch = (episodeSearch: string) => {
		useEpisodeStoreUtil.setState(() => ({ episodeSearch }))
	}

	const setIsDialogOpen = (isDialogOpen: boolean) => {
		useEpisodeStoreUtil.setState({ isDialogOpen })
	}

	const setIsInventOpen = (isInventOpen: boolean) => {
		useEpisodeStoreUtil.setState({ isInventOpen })
	}

	const setAlertInfo = (alertInfo: EpisodeStoreState['alertInfo']) => {
		useEpisodeStoreUtil.setState({ alertInfo })
	}

	const setSelectedEpisodes = (
		selectedEpisodes: EpisodeStoreState['selectedEpisodes']
	) => {
		useEpisodeStoreUtil.setState({ selectedEpisodes })
	}
	const setDeleteEpisodeId = (
		deleteEpisodeId: EpisodeStoreState['deleteEpisodeId']
	) => {
		useEpisodeStoreUtil.setState({ deleteEpisodeId })
	}

	const setInventIndex = (currentInventIndex: number) => {
		useEpisodeStoreUtil.setState({ currentInventIndex })
	}

	return {
		setCurrentPage,
		setEpisodeSearch,
		setIsDialogOpen,
		setIsInventOpen,
		setAlertInfo,
		setSelectedEpisodes,
		setDeleteEpisodeId,
		setInventIndex,
		useEpisodeTableStore: useEpisodeStoreUtil,
	}
}

import useEpisodeTableContext from '@/providers/episode-table-provider'

import { EpisodeStoreState } from '@/types/episode-type'
import { TNote } from '@/types/plate-types'

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

	const setIsShareAccessDialogOpen = (isSharedAccessDialogOpen: boolean) => {
		useEpisodeStoreUtil.setState({ isSharedAccessDialogOpen })
	}

	const setShowSharedList = (showSharedList: boolean) => {
		useEpisodeStoreUtil.setState({ showSharedList })
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

	const setInventSeq = (currentInventSeq: number) => {
		useEpisodeStoreUtil.setState({ currentInventSeq })
	}

	const setNotes = (notes: EpisodeStoreState['notes']) => {
		useEpisodeStoreUtil.setState(() => {
			return { notes }
		})
	}

	const addNote = (
		note: EpisodeStoreState['notes'][number],
		addToStart = false
	) => {
		useEpisodeStoreUtil.setState((state) => ({
			notes: addToStart ? [note, ...state.notes] : [...state.notes, note],
		}))
	}

	const deleteNote = (noteId: EpisodeStoreState['notes'][number]['id']) => {
		useEpisodeStoreUtil.setState((state) => {
			return {
				notes: state.notes.filter((note) => note.id !== noteId),
			}
		})
	}

	const updateNote = (noteId: string, params: Partial<TNote>) => {
		useEpisodeStoreUtil.setState((state) => {
			const updatedNotes = state.notes.map((note) =>
				note.id === noteId ? { ...note, ...params } : note
			)

			return { notes: updatedNotes }
		})
	}

	const setStatusUpdating = (statusUpdating: number[]) => {
		useEpisodeStoreUtil.setState(() => {
			return {
				statusUpdating,
			}
		})
	}

	const setBseDialogOpen = (isBseDialogOpen: boolean) => {
		useEpisodeStoreUtil.setState({ isBseDialogOpen })
	}

	return {
		setCurrentPage,
		setEpisodeSearch,
		setIsDialogOpen,
		setIsInventOpen,
		setShowSharedList,
		setIsShareAccessDialogOpen,
		setAlertInfo,
		setSelectedEpisodes,
		setDeleteEpisodeId,
		setInventSeq,
		setNotes,
		addNote,
		deleteNote,
		updateNote,
		useEpisodeTableStore: useEpisodeStoreUtil,
		setStatusUpdating,
		setBseDialogOpen,
	}
}

import { useEpisodeContext } from '@/providers/episode-id-provider'

import { EpisodeIdStoreType } from '@/types/episode-type'

function useEpisodeIdStore() {
	const { useEpisodeIdStoreContext } = useEpisodeContext()

	const setSelectedStatus = (
		selectedStatus: EpisodeIdStoreType['selectedStatus']
	) => {
		useEpisodeIdStoreContext.setState(() => {
			return { selectedStatus }
		})
	}

	const setCurrentTitle = (
		currentTitle: EpisodeIdStoreType['currentTitle']
	) => {
		useEpisodeIdStoreContext.setState(() => {
			return { currentTitle }
		})
	}

	const setNotes = (notes: EpisodeIdStoreType['notes']) => {
		useEpisodeIdStoreContext.setState(() => {
			return { notes }
		})
	}

	const addNote = (note: EpisodeIdStoreType['notes'][number]) => {
		useEpisodeIdStoreContext.setState((state) => {
			return { notes: [...state.notes, note] }
		})
	}

	const deleteNote = (noteId: EpisodeIdStoreType['notes'][number]['id']) => {
		useEpisodeIdStoreContext.setState((state) => {
			return {
				notes: state.notes.filter((note) => note.id !== noteId),
			}
		})
	}

	const setStartOverlayLoading = (
		startOverlayLoading: EpisodeIdStoreType['startOverlayLoading']
	) => {
		useEpisodeIdStoreContext.setState(() => {
			return { startOverlayLoading }
		})
	}

	const setResolvedComments = (
		resolvedComments: EpisodeIdStoreType['resolvedComments']
	) => {
		useEpisodeIdStoreContext.setState(() => {
			return { resolvedComments }
		})
	}

	const addResolvedComment = (
		resolvedComment: EpisodeIdStoreType['resolvedComments'][number]
	) => {
		useEpisodeIdStoreContext.setState((state) => {
			return { resolvedComments: [...state.resolvedComments, resolvedComment] }
		})
	}

	const removeResolvedComment = (resolvedCommentId: string) => {
		useEpisodeIdStoreContext.setState((state) => {
			return {
				resolvedComments: state.resolvedComments.filter(
					(comment) => comment.id !== resolvedCommentId
				),
			}
		})
	}

	return {
		store: useEpisodeIdStoreContext,
		setSelectedStatus,
		setCurrentTitle,
		setNotes,
		addNote,
		deleteNote,
		setStartOverlayLoading,
		addResolvedComment,
		setResolvedComments,
		removeResolvedComment,
	}
}

export default useEpisodeIdStore

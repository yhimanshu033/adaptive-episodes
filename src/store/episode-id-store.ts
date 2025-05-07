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

	const setDualViewMode = (
		dualViewMode: EpisodeIdStoreType['dualViewMode']
	) => {
		useEpisodeIdStoreContext.setState(() => {
			return { dualViewMode }
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

	const setActiveNoteId = (activeNoteId: string | null) => {
		useEpisodeIdStoreContext.setState({ activeNoteId })
	}

	const setSelectedLanguage = (
		selectedLanguage: EpisodeIdStoreType['selectedLanguage']
	) => {
		useEpisodeIdStoreContext.setState({ selectedLanguage })
	}

	return {
		store: useEpisodeIdStoreContext,
		setSelectedStatus,
		setCurrentTitle,
		setDualViewMode,
		setStartOverlayLoading,
		addResolvedComment,
		setResolvedComments,
		removeResolvedComment,
		setActiveNoteId,
		setSelectedLanguage,
	}
}

export default useEpisodeIdStore

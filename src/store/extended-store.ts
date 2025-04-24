import useEditorExtendedState from '@/hooks/use-editor-extend-state'

import { EditorExtendedStore } from '@/types/editor-types'

function useEditorExtendedStore() {
	const { useEpisodeExtendedStoreUtil } = useEditorExtendedState()

	const setExtended = (extended: EditorExtendedStore['extended']) => {
		useEpisodeExtendedStoreUtil.setState(() => {
			return { extended }
		})
	}

	const updateExtended = (episodeId: number, direction: 'prev' | 'next') => {
		useEpisodeExtendedStoreUtil.setState((state) => {
			const updatedExtended =
				direction === 'next'
					? [...state.extended, episodeId]
					: [episodeId, ...state.extended]
			return { extended: updatedExtended }
		})
	}

	const setEpisodeMap = (episodeMap: EditorExtendedStore['episodeMap']) => {
		useEpisodeExtendedStoreUtil.setState(() => {
			return { episodeMap }
		})
	}

	const addEpisodeMap = (
		id: number,
		episode: EditorExtendedStore['episodeMap'][number]
	) => {
		useEpisodeExtendedStoreUtil.setState((state) => {
			return { episodeMap: { ...state.episodeMap, [id]: episode } }
		})
	}

	const addEpisodeKey = (
		id: number,
		keys: EditorExtendedStore['episodeKeys'][number]
	) => {
		useEpisodeExtendedStoreUtil.setState((state) => {
			return { episodeKeys: { ...state.episodeKeys, [id]: keys } }
		})
	}

	const setExtendedContentMap = (
		episodeContentMap: EditorExtendedStore['episodeContentMap']
	) => {
		useEpisodeExtendedStoreUtil.setState(() => {
			return { episodeContentMap }
		})
	}

	const addExtendedContentMap = (
		key: number,
		episodeContent: EditorExtendedStore['episodeContentMap'][number]
	) => {
		useEpisodeExtendedStoreUtil.setState((state) => {
			return {
				episodeContentMap: {
					...state.episodeContentMap,
					[key]: episodeContent,
				},
			}
		})
	}

	return {
		store: useEpisodeExtendedStoreUtil,
		setEpisodeMap,
		setExtended,
		updateExtended,
		addEpisodeMap,
		addEpisodeKey,
		setExtendedContentMap,
		addExtendedContentMap,
	}
}

export default useEditorExtendedStore

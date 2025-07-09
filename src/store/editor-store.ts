import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

type EditorStoreState = {
	isEpisodeNavigationOpen: boolean
}

const initialState: EditorStoreState = {
	isEpisodeNavigationOpen: false,
}

export const useEditorStore = create(devtools(immer(() => initialState)))

export const updateIsEpisodeNavigationOpen = (
	isEpisodeNavigationOpen: boolean
) => {
	useEditorStore.setState(() => ({ isEpisodeNavigationOpen }))
}

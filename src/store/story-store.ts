import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

import { TStoryStoreState } from '@/types/story-types'

const initialState: TStoryStoreState = {
	isFormOpen: false,
}

const useStoryStore = create(devtools(immer(() => initialState)))

export const setFormOpen = (isFormOpen: boolean) => {
	useStoryStore.setState({ isFormOpen })
}

export default useStoryStore

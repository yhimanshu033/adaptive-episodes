import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

import { PlateStoreData } from '@/types/plate-types'

const initialState: PlateStoreData = {
	isTranslationOpen: false,
	sidebar: null,
}

const usePlateStore = create(devtools(immer(() => initialState)))

export const toggleTranslation = () => {
	usePlateStore.setState((state) => {
		return { isTranslationOpen: !state.isTranslationOpen }
	})
}

export const setSidebar = (
	sidebar: PlateStoreData['sidebar'],
	toggle?: boolean
) => {
	usePlateStore.setState((state) => {
		return { sidebar: toggle && state.sidebar === sidebar ? null : sidebar }
	})
}
export default usePlateStore

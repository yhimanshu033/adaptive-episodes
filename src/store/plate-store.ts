import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

import { PlateStoreData } from '@/types/plate-types'

const initialState: PlateStoreData = {
	isTranslationOpen: false,
	sidebar: null,
	resolved: false,
	scale: 1,
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

export const setResolved = (resolved: boolean, toggle?: boolean) => {
	usePlateStore.setState((state) => {
		return { resolved: toggle ? !state.resolved : resolved }
	})
}

export const setScale = (scale: number) => {
	usePlateStore.setState({ scale })
}

export default usePlateStore

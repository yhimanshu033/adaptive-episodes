import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

import { PlateStoreData } from '@/types/plate-types'

const initialState: PlateStoreData = {
	commentSidebarOpen: false,
}

const usePlateStore = create(devtools(immer(() => initialState)))

export const toggleCommentSidebar = () => {
	usePlateStore.setState((state) => {
		return { commentSidebarOpen: !state.commentSidebarOpen }
	})
}

export default usePlateStore

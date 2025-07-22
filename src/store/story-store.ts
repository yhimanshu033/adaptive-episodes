// store/story-store.ts
import { CI_DIALOG_TITLE } from '@/constants/story-constants'
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

import { TStoryStoreState } from '@/types/story-types'

const useStoryStore = create<TStoryStoreState>()(
	devtools(
		immer((set) => ({
			isFormOpen: false,
			showTitle: true,
			title: CI_DIALOG_TITLE.DEFAULT,
			setFormOpen: (isOpen) =>
				set((state) => {
					state.isFormOpen = isOpen
				}),
			setShowTitle: (show) =>
				set((state) => {
					state.showTitle = show
				}),
			setTitle: (title) =>
				set((state) => {
					state.title = title
				}),
		}))
	)
)

export default useStoryStore

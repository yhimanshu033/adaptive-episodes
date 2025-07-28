// stores/comment-store.ts
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

type TUseShowExampleVisibility = {
	isVisible: (commentId: string) => boolean
	setShowExample: (commentId: string, isVisible: boolean) => void
	showExampleMap: Record<string, boolean>
}

const useShowExampleVisibility = create<TUseShowExampleVisibility>()(
	devtools(
		immer((set, get) => ({
			showExampleMap: {},

			setShowExample: (commentId, isVisible) => {
				set((state) => {
					state.showExampleMap[commentId] = isVisible
				})
			},

			isVisible: (commentId) => {
				return !!get().showExampleMap[commentId]
			},
		}))
	)
)

export default useShowExampleVisibility

import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

import { TPromptEditorState } from '@/types/edit-prompts-types'

const usePromptEditorStore = create<TPromptEditorState>()(
	devtools(
		immer((set) => ({
			isFormOpen: false,
			setFormOpen: (isOpen) =>
				set((state) => {
					state.isFormOpen = isOpen
				}),
		}))
	)
)

export default usePromptEditorStore

import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

type EditNoteMode = 'add' | 'save'

type TEditNoteState = {
	isFormOpen: boolean
	mode: EditNoteMode
	setFormOpen: (isOpen: boolean) => void
	setMode: (mode: EditNoteMode) => void
}

const useEditorNoteStore = create<TEditNoteState>()(
	devtools(
		immer((set) => ({
			mode: 'add',
			isFormOpen: false,
			setMode: (mode) => {
				set((state) => {
					state.mode = mode
				})
			},
			setFormOpen: (isOpen) => {
				set((state) => {
					state.isFormOpen = isOpen
				})
			},
		}))
	)
)

export default useEditorNoteStore

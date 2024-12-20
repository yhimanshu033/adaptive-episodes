import { create } from 'zustand'

export const extendStore = create<{
	extended: number[]
	setExtended: (value: number[]) => void
}>((set) => ({
	extended: [],
	setExtended: (value) => set({ extended: value }),
}))

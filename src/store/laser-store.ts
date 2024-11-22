import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

type Laser = {
	caretEnd?: number
	caretPos?: number
	clientX?: number
	clientY?: number
	prompt: string
}
type LaserStoreType = {
	active: string | null
	editorX?: number
	editorY?: number
	lasers: Record<string, Laser>
	promptActive: string | null
	triggerRephrase?: string | null
}

const initialState: LaserStoreType = {
	lasers: {},
	promptActive: null,
	active: null,
}

const useLaserStore = create(
	devtools(immer<LaserStoreType>(() => initialState))
)

export const setLaser = (laser: { id: string; laser: Laser }) => {
	useLaserStore.setState((state) => {
		state.lasers[laser.id] = laser.laser
	})
}

export const setPrompt = (prompt: string) => {
	useLaserStore.setState((state) => {
		state.lasers[state.active!].prompt = prompt
	})
}

export const getPrompt = () => {
	return useLaserStore.getState().lasers[useLaserStore.getState().active!]
		?.prompt
}

export const getActiveLaser = () => {
	return useLaserStore.getState().active
}

export const setActiveLaser = (id: string | null) => {
	useLaserStore.setState({ active: id })
}

export const setPromptActive = (value: string | null) => {
	useLaserStore.setState({ promptActive: value })
}

export const getLaser = (id: string) => {
	return useLaserStore.getState().lasers[id]
}

export const setEditorCoords = (x: number, y: number) => {
	useLaserStore.setState({ editorX: x, editorY: y })
}

export const setTriggerRephrase = (value: string | null) => {
	useLaserStore.setState({ triggerRephrase: value })
}

export default useLaserStore

import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

type Laser = {
	clientY?: number
	response: string
	text: string
}
type LaserStoreType = {
	active: string | null
	editorX?: number
	editorY?: number
	lasers: Record<string, Laser>
	promptActive: string | null
	responseActive: string | null
	screenY?: number
	triggerRephrase?: string | null
}

const initialState: LaserStoreType = {
	lasers: {},
	promptActive: null,
	active: null,
	responseActive: null,
}

const useLaserStore = create(
	devtools(immer<LaserStoreType>(() => initialState))
)

export const setLaser = (laser: { id: string; laser: Laser }) => {
	useLaserStore.setState((state) => {
		state.lasers[laser.id] = laser.laser
	})
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

export const setScreenY = (screenY: number) => {
	useLaserStore.setState({ screenY })
}

export const setResponseActive = (responseActive: string | null) => {
	useLaserStore.setState({ responseActive })
}
export default useLaserStore

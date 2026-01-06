import { useEpisodeContext } from '@/providers/episode-id-provider'

import { Laser } from '@/types/ai-types'

function useLaserStore() {
	const { useLaserContext } = useEpisodeContext()

	const setLaser = (laser: { id: string; laser: Laser }) => {
		useLaserContext.setState((state) => {
			return { lasers: { ...state.lasers, [laser.id]: laser.laser } }
		})
	}

	const setActiveLaser = (id: string | null) => {
		useLaserContext.setState({ active: id })
	}

	const setPromptActive = (value: string | null) => {
		useLaserContext.setState({ promptActive: value })
	}

	const getLaser = (id: string) => {
		return useLaserContext.getState().lasers[id]
	}

	const setEditorCoords = (x: number, y: number) => {
		useLaserContext.setState({ editorX: x, editorY: y })
	}

	const setTriggerRephrase = (value: string | null) => {
		useLaserContext.setState({ triggerRephrase: value })
	}

	const setResponseActive = (responseActive: string | null) => {
		useLaserContext.setState({ responseActive })
	}

	return {
		store: useLaserContext,
		setLaser,
		setActiveLaser,
		setPromptActive,
		getLaser,
		setEditorCoords,
		setTriggerRephrase,
		setResponseActive,
	}
}

export default useLaserStore

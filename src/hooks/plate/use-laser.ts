import { useEditorPlugin } from '@udecode/plate-common/react'

import { LaserPlugin } from '@/lib/plate/plugins/laser-plugin'

export default function useLaser() {
	const { useOption, setOption } = useEditorPlugin(LaserPlugin)
	const laserStore = useOption('laserStore')
	const activeLaser = useOption('active')
	const promptActive = useOption('prompt')
	const setPromptActive = (value: boolean) => setOption('prompt', value)
	const lasers = laserStore.get.lasers()
	const getPrompt = (id: string) => lasers[id]?.prompt || ''
	const setPrompt = (id: string, value: string) =>
		laserStore.set.lasers({ ...lasers, [id]: { ...lasers[id], prompt: value } })

	return {
		useOption,
		setOption,
		activeLaser,
		laserStore,
		promptActive,
		setPromptActive,
		getPrompt,
		setPrompt,
		lasers,
	}
}

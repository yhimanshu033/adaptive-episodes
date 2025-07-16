import { PluginConfig } from 'platejs'
import { createTPlatePlugin } from 'platejs/react'

import { createLaserStore } from '@/lib/plate/plugins/laser-plugin/store'

export type LaserPluginT = PluginConfig<
	'laser',
	{
		active: string | null
		laserStore: ReturnType<typeof createLaserStore>
		prompt: boolean
	},
	object
>

export function getLaserPlugin() {
	const LaserPlugin = createTPlatePlugin({
		key: 'laser',
		node: {
			isLeaf: true,
		},
		options: {
			laserStore: createLaserStore(),
			active: null,
			prompt: false,
		},
	})
	return LaserPlugin
}

export const LaserPlugin = getLaserPlugin()

export type PromptPluginT = PluginConfig<
	'floating-prompt',
	Record<string, never>,
	object
>
export function getPromptPlugin() {
	return createTPlatePlugin({
		key: 'floating-prompt',
		node: {
			isLeaf: true,
		},
		options: {},
	})
}

export const PromptPlugin = getPromptPlugin()

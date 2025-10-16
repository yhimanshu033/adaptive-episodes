import {
	LASER_LEAF_KEYS,
	LASER_PROMPT_KEYS,
} from '@/constants/editor-constants'
import { PluginConfig } from 'platejs'
import { createTPlatePlugin } from 'platejs/react'

import { createLaserStore } from '@/lib/plate/plugins/laser-plugin/store'

export type LaserPluginT = PluginConfig<
	typeof LASER_LEAF_KEYS.KEY,
	{
		active: string | null
		laserStore: ReturnType<typeof createLaserStore>
		prompt: boolean
	},
	object
>

export function getLaserPlugin() {
	const LaserPlugin = createTPlatePlugin({
		key: LASER_LEAF_KEYS.KEY,
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
	typeof LASER_PROMPT_KEYS.KEY,
	Record<string, never>,
	object
>
export function getPromptPlugin() {
	return createTPlatePlugin({
		key: LASER_PROMPT_KEYS.KEY,
		node: {
			isLeaf: true,
		},
		options: {},
	})
}

export const PromptPlugin = getPromptPlugin()

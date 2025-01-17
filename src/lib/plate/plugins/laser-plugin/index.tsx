import { createTPlatePlugin } from '@udecode/plate-common/react'
import { PluginConfig } from '@udecode/plate-core'

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
	const LaserPlugin = createTPlatePlugin<LaserPluginT>({
		key: 'laser',
		node: {
			isLeaf: true,
		},
		options: {
			laserStore: createLaserStore({
				lasers: {},
				test: 45,
			}),
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
	const PromptPlugin = createTPlatePlugin<PromptPluginT>({
		key: 'floating-prompt',
		node: {
			isLeaf: true,
		},
		options: {},
	})
	return PromptPlugin
}

export const PromptPlugin = getPromptPlugin()

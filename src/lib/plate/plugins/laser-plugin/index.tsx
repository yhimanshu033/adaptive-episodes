import { createTPlatePlugin } from '@udecode/plate-common/react'
import { PluginConfig } from '@udecode/plate-core'

import { createLaserStore } from './store'

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

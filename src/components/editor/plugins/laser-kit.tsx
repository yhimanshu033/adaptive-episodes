'use client'

import { BlockLaser } from '@/components/plate-ui-v2/block-laser'
import { LaserLeaf } from '@/components/plate-ui/laser-leaf'
import { getLaserPlugin } from '@/lib/plate/plugins/laser-plugin'

export const LaserKit = [
	getLaserPlugin().configure({
		render: { node: LaserLeaf, belowNodes: BlockLaser },
	}),
]

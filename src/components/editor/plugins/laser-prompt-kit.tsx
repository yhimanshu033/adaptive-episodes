'use client'

import LaserPromptLeaf from '@/components/plate-ui/laser-prompt-leaf'
import { getPromptPlugin } from '@/lib/plate/plugins/laser-plugin'

export const LaserPromptKit = [
	getPromptPlugin().configure({
		render: { node: LaserPromptLeaf },
	}),
]

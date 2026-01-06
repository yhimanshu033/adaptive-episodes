'use client'

import { BlockPrompt } from '@/components/plate-ui-v2/block-prompt'
import LaserPromptLeaf from '@/components/plate-ui/laser-prompt-leaf'
import { getPromptPlugin } from '@/lib/plate/plugins/laser-plugin'

export const LaserPromptKit = [
	getPromptPlugin().configure({
		render: { node: LaserPromptLeaf, belowNodes: BlockPrompt },
	}),
]

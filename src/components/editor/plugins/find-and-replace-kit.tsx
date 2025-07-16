'use client'

import { INITIAL_FAR_OPTIONS } from '@/constants/ai-constants'

import { SearchHighlightLeaf } from '@/components/plate-ui-v2/search-highlight-node'
import { FindReplacePlugin } from '@/lib/plate/plugins/find-replace'

export const FindAndReplaceKit = [
	FindReplacePlugin.configure({
		options: INITIAL_FAR_OPTIONS,
		render: { node: SearchHighlightLeaf },
	}),
]

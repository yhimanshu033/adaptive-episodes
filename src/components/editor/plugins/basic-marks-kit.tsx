'use client'

import {
	BoldPlugin,
	HighlightPlugin,
	ItalicPlugin,
	StrikethroughPlugin,
	SubscriptPlugin,
	SuperscriptPlugin,
	UnderlinePlugin,
} from '@platejs/basic-nodes/react'

import { HighlightLeaf } from '@/components/plate-ui-v2/highlight-node'

// COMMENTING UNNECESSARY PLUGINS FOR OPTIMIZATION
export const BasicMarksKit = [
	BoldPlugin,
	ItalicPlugin,
	UnderlinePlugin,
	// CodePlugin.configure({
	// 	node: { component: CodeLeaf },
	// 	shortcuts: { toggle: { keys: 'mod+e' } },
	// }),
	StrikethroughPlugin.configure({
		shortcuts: { toggle: { keys: 'mod+shift+x' } },
	}),
	SubscriptPlugin.configure({
		shortcuts: { toggle: { keys: 'mod+comma' } },
	}),
	SuperscriptPlugin.configure({
		shortcuts: { toggle: { keys: 'mod+period' } },
	}),
	HighlightPlugin.configure({
		node: { component: HighlightLeaf },
		shortcuts: { toggle: { keys: 'mod+shift+h' } },
	}),
	// KbdPlugin.withComponent(KbdLeaf),
]

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
'use client'

import * as React from 'react'
import { DndPlugin } from '@platejs/dnd'
import { PlaceholderPlugin } from '@platejs/media/react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

// import { BlockDraggable } from '@/components/plate-ui-v2/block-draggable'

export const DndKit = [
	DndPlugin.configure({
		options: {
			enableScroller: true,
			onDropFiles: ({ dragItem, editor, target }) => {
				editor
					.getTransforms(PlaceholderPlugin)
					.insert.media(dragItem.files, { at: target, nextBlock: false })
			},
		},
		render: {
			// aboveNodes: BlockDraggable,
			aboveSlate: ({ children }) => (
				<DndProvider backend={HTML5Backend}>{children}</DndProvider>
			),
		},
	}),
]

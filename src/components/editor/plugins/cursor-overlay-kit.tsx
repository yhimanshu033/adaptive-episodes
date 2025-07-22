'use client'

import * as React from 'react'
import { CursorOverlayPlugin } from '@platejs/selection/react'

import { CursorOverlay } from '@/components/plate-ui-v2/cursor-overlay'

export const CursorOverlayKit = [
	CursorOverlayPlugin.configure({
		render: {
			afterEditable: () => <CursorOverlay />,
		},
	}),
]

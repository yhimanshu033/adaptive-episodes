'use client'

import React from 'react'
import { createPlatePlugin } from 'platejs/react'

import { FixedToolbar } from '@/components/plate-ui-v2/fixed-toolbar'
import { FixedToolbarButtons } from '@/components/plate-ui-v2/fixed-toolbar-buttons'

export const FixedToolbarKit = [
	createPlatePlugin({
		key: 'fixed-toolbar',
		render: {
			beforeEditable: () => (
				<FixedToolbar>
					<FixedToolbarButtons />
				</FixedToolbar>
			),
		},
	}),
]

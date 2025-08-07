'use client'

import React from 'react'
import { withGetFragmentExcludeDiff } from '@platejs/diff'
import { createSlatePlugin } from 'platejs'
import { toPlatePlugin } from 'platejs/react'

import DiffBlock from '@/components/plate-ui-v2/diff-block'
import DiffLeaf from '@/components/plate-ui-v2/diff-node'

// This plugin is for showing difference-view between 2 versions of content
export const DiffPlugin = toPlatePlugin(
	createSlatePlugin({
		key: 'diff',
		node: { isLeaf: true },
	}).overrideEditor(withGetFragmentExcludeDiff),
	{
		render: {
			node: DiffLeaf,
			aboveNodes: () => (props) => {
				const { element } = props
				if (!element.diff) {
					return element.children as React.ReactNode
				}

				return <DiffBlock key="diff" {...props} />
			},
		},
	}
)

export const DiffKit = [DiffPlugin]

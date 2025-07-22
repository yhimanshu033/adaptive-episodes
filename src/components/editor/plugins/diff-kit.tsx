'use client'

import React from 'react'
import { AiDiffOperation } from '@/constants/ai-constants'
import { DiffOperation, withGetFragmentExcludeDiff } from '@platejs/diff'
import { createSlatePlugin } from 'platejs'
import { toPlatePlugin } from 'platejs/react'

import DiffLeaf from '@/components/plate-ui-v2/diff-node'
import { describeUpdate, diffOperationColors } from '@/lib/plate/diff-helpers'

// This plugin is purely UI. It's only used to store the discussions and users data
export const DiffPlugin = toPlatePlugin(
	createSlatePlugin({
		key: 'diff',
		node: { isLeaf: true },
	}).overrideEditor(withGetFragmentExcludeDiff),
	{
		render: {
			node: DiffLeaf,
			aboveNodes:
				() =>
				({ children, editor, element }) => {
					if (!element.diff) {
						return children as React.ReactNode
					}

					const diffOperation = element.diffOperation as DiffOperation

					const label = {
						[AiDiffOperation.DELETE]: 'deletion',
						[AiDiffOperation.INSERT]: 'insertion',
						[AiDiffOperation.UPDATE]: 'update',
					}[diffOperation?.type]

					const Component = editor.api.isInline(element) ? 'span' : 'div'

					return (
						<Component
							className={diffOperationColors[diffOperation.type]}
							title={
								diffOperation.type === 'update'
									? describeUpdate(diffOperation)
									: undefined
							}
							aria-label={label}
						>
							{children}
						</Component>
					)
				},
		},
	}
)

export const DiffKit = [DiffPlugin]

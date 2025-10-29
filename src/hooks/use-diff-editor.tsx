/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React from 'react'
import { PlatePlugin, usePlateEditor } from 'platejs/react'

import { BasicBlocksKit } from '@/components/editor/plugins/basic-blocks-kit'
import { BasicMarksKit } from '@/components/editor/plugins/basic-marks-kit'
import { DiffPlugin } from '@/components/editor/plugins/diff-kit'
import DiffLeaf from '@/components/plate-ui-v2/diff-node'

import { DiffViewProps } from '@/types/plate-types'

export const diffPlugins = [
	...BasicBlocksKit,
	...BasicMarksKit,
	DiffPlugin,
] as PlatePlugin[]

export const useDiffEditor = ({ readonly = false }: DiffViewProps) => {
	const editor = usePlateEditor(
		{
			plugins: diffPlugins,
			value: [],
			override: {
				components: {
					[DiffPlugin.key]: (props) => (
						<DiffLeaf {...props} readonly={readonly} />
					),
				},
			},
		},
		[]
	)

	return editor
}

/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React, { useEffect, useMemo } from 'react'
import { DIFF_EDITOR_ID } from '@/constants/editor-constants'
import useAIStore from '@/store/ai-store'
import {
	BoldPlugin,
	ItalicPlugin,
	UnderlinePlugin,
} from '@platejs/basic-nodes/react'
import { computeDiff } from '@platejs/diff'
import { ExitBreakPlugin, Value } from 'platejs'
import { createPlateEditor, PlatePlugin, usePlateEditor } from 'platejs/react'

import { DiffPlugin } from '@/components/editor/plugins/diff-kit'
import DiffLeaf from '@/components/plate-ui-v2/diff-node'
import {
	getDeleteProps,
	getInsertProps,
	getUpdateProps,
} from '@/lib/plate/diff-helpers'

import { DiffViewProps } from '@/types/plate-types'

export const useDiffEditor = ({
	current,
	previous,
	readonly = false,
}: DiffViewProps) => {
	const plugins = useMemo(
		() =>
			[
				BoldPlugin,
				ItalicPlugin,
				UnderlinePlugin,
				DiffPlugin,
				ExitBreakPlugin,
			] as PlatePlugin[],
		[]
	)

	const diffValue = useMemo(() => {
		const editor = createPlateEditor({
			plugins,
			id: DIFF_EDITOR_ID,
		})
		if (!previous || !current) {
			return []
		}
		return computeDiff(structuredClone(previous), structuredClone(current), {
			isInline: editor.api.isInline,
			getInsertProps,
			getDeleteProps,
			getUpdateProps,
		}) as Value
	}, [previous, current, plugins])
	const { setAcceptedValue } = useAIStore()

	useEffect(() => {
		if (readonly) {
			return
		}
		setAcceptedValue(diffValue)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [diffValue, readonly])

	const editor = usePlateEditor(
		{
			plugins,
			value: diffValue,
			override: {
				components: {
					[DiffPlugin.key]: (props) => (
						<DiffLeaf {...props} readonly={readonly} />
					),
				},
			},
		},
		[diffValue]
	)

	return editor
}

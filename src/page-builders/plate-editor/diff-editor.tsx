/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import React, { useEffect, useMemo } from 'react'
import { DiffStatus } from '@/constants/ai-constants'
import { DIFF_EDITOR_ID } from '@/constants/editor-constants'
import { diffPlugins, useDiffEditor } from '@/hooks/use-diff-editor'
import useAIStore from '@/store/ai-store'
import usePlateStore from '@/store/plate-store'
import { computeDiff } from '@platejs/diff'
import { Value } from 'platejs'
import {
	createPlateEditor,
	Plate,
	PlateEditor,
	useEditorState,
} from 'platejs/react'

import { DiffPlugin } from '@/components/editor/plugins/diff-kit'
import { Editor } from '@/components/plate-ui-v2/editor'
import {
	getDeleteProps,
	getInsertProps,
	getUpdateProps,
} from '@/lib/plate/diff-helpers'

import { DiffViewProps } from '@/types/plate-types'

const DiffContent = ({ className }: { className?: string }) => {
	const editor = useEditorState(DIFF_EDITOR_ID)

	const { setDiffIdList } = usePlateStore()
	const findAllDiffNodes = <E extends PlateEditor>(
		editor: E
	): Array<{ node: any; path: any }> =>
		Array.from(
			editor.api.nodes({
				match: (n: any) =>
					DiffPlugin.key in n && n.status === DiffStatus.PENDING,
				at: [],
			}),
			([node, path]) => ({ node, path })
		)

	useEffect(() => {
		setDiffIdList(findAllDiffNodes(editor).map((n) => n.node.diff_id as string))
	}, [editor, setDiffIdList])

	return <Editor variant="aural" className={className} />
}

export default function DiffEditor({
	current,
	previous,
	className,
	readonly,
}: DiffViewProps) {
	const editor = useDiffEditor({ readonly })

	const diffValue = useMemo(() => {
		const editor = createPlateEditor({
			plugins: diffPlugins,
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
	}, [previous, current])
	const { setAcceptedValue } = useAIStore()

	useEffect(() => {
		if (readonly) {
			return
		}
		setAcceptedValue(diffValue)
		editor.tf.setValue(diffValue)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [diffValue, readonly])

	if (!previous || !current) {
		return null
	}

	return (
		<Plate editor={editor} readOnly>
			<DiffContent className={className} />
		</Plate>
	)
}

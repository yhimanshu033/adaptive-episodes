/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import React, { useEffect } from 'react'
import { DiffStatus } from '@/constants/ai-constants'
import { DIFF_EDITOR_ID } from '@/constants/editor-constants'
import { useDiffEditor } from '@/hooks/use-diff-editor'
import usePlateStore from '@/store/plate-store'
import { Plate, PlateEditor, useEditorState } from 'platejs/react'

import { DiffViewProps } from '@/types/plate-types'

import { Editor } from '../plate-ui-v2/editor'
import { DiffPlugin } from './plugins/diff-kit'

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
	const editor = useDiffEditor({ current, previous, readonly })

	if (!previous || !current) {
		return null
	}

	return (
		<Plate editor={editor} readOnly>
			<DiffContent className={className} />
		</Plate>
	)
}

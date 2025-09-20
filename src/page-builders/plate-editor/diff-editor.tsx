/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import React, { useEffect, useMemo } from 'react'
import { DIFF_EDITOR_ID } from '@/constants/editor-constants'
import { useDiffEditor } from '@/hooks/use-diff-editor'
import useEpisodeIdStore from '@/store/episode-id-store'
import usePlateStore from '@/store/plate-store'
import { computeDiff } from '@platejs/diff'
import { Value } from 'platejs'
import { Plate, useEditorState } from 'platejs/react'
import { useShallow } from 'zustand/react/shallow'

import { Editor } from '@/components/plate-ui-v2/editor'
import {
	getDeleteProps,
	getInsertProps,
	getUpdateProps,
} from '@/lib/plate/diff-helpers'
import { findAllDiffNodes } from '@/lib/utils/client-helpers'
import { getDiffLeafID } from '@/lib/utils/plate'

import { DiffViewProps } from '@/types/plate-types'

export const DiffContent = ({ className }: { className?: string }) => {
	const editor = useEditorState(DIFF_EDITOR_ID)

	const { setDiffIdList, store } = usePlateStore()
	const activeDiffId = store(useShallow((state) => state.activeDiffId))

	useEffect(() => {
		if (!activeDiffId) {
			return
		}
		const elem = document.getElementById(getDiffLeafID(activeDiffId))
		if (!elem) {
			return
		}
		requestAnimationFrame(() => {
			elem.scrollIntoView({ behavior: 'smooth', block: 'center' })
		})
	}, [activeDiffId])

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
		if (!previous || !current) {
			return []
		}
		return computeDiff(structuredClone(previous), structuredClone(current), {
			isInline: editor.api.isInline,
			getInsertProps,
			getDeleteProps,
			getUpdateProps,
		}) as Value
	}, [previous, current, editor.api.isInline])

	const { setAcceptedDiffValue } = useEpisodeIdStore()

	useEffect(() => {
		editor.tf.setValue(diffValue)
		if (readonly) {
			return
		}
		setAcceptedDiffValue(diffValue)
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

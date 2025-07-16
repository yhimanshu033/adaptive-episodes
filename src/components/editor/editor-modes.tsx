import React, { useEffect, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import { SIMPLIFIED_VIEWABLE_EDITOR } from '@/constants/global-constants'
import useAIStore from '@/store/ai-store'
import useLaserStore from '@/store/laser-store'
import usePlateStore from '@/store/plate-store'
import { useShallow } from 'zustand/react/shallow'

import { Editor } from '@/components/plate-ui-v2/editor'

import { ESidebar } from '@/types/plate-types'

import DiffEditor from './diff-editor'

const EditorModes = ({ className }: { className?: string }) => {
	const { store } = usePlateStore()
	const { store: AiStore } = useAIStore()
	const { setEditorCoords } = useLaserStore()

	const sidebar = store((state) => state.sidebar)
	const { responseValue, prevValue } = AiStore(
		useShallow((state) => ({
			responseValue: state.responseValue,
			prevValue: state.prevValue,
		}))
	)

	const editorContainerRef = useRef<HTMLDivElement>(null)
	const searchParams = useSearchParams()
	const simplifiedEditor = searchParams.get(SIMPLIFIED_VIEWABLE_EDITOR)
	const isDiff = sidebar === ESidebar.CHATBOT && responseValue && prevValue

	useEffect(() => {
		if (!editorContainerRef.current) {
			return
		}

		const rect = editorContainerRef.current.getBoundingClientRect()
		setEditorCoords(rect.x, rect.y)
	}, [setEditorCoords])

	return isDiff ? (
		<DiffEditor
			current={responseValue}
			previous={prevValue}
			className={className}
		/>
	) : (
		<Editor
			ref={editorContainerRef}
			placeholder="Type..."
			autoFocus
			variant="aural"
			readOnly={!!simplifiedEditor}
			className={className}
		/>
	)
}

export default EditorModes

import React from 'react'
import { useSearchParams } from 'next/navigation'
import { SIMPLIFIED_VIEWABLE_EDITOR } from '@/constants/global-constants'
import useAIStore from '@/store/ai-store'
import usePlateStore from '@/store/plate-store'
import { useReadOnly } from 'platejs/react'
import { useShallow } from 'zustand/react/shallow'

import { Editor } from '@/components/plate-ui-v2/editor'

import { ESidebar } from '@/types/plate-types'

import DiffEditor from './diff-editor'

const EditorHandler = ({ className }: { className?: string }) => {
	const { store } = usePlateStore()
	const { store: AiStore } = useAIStore()
	const readOnly = useReadOnly()

	const sidebar = store((state) => state.sidebar)
	const { responseValue, prevValue } = AiStore(
		useShallow((state) => ({
			responseValue: state.responseValue,
			prevValue: state.prevValue,
		}))
	)

	const searchParams = useSearchParams()
	const simplifiedEditor = searchParams.get(SIMPLIFIED_VIEWABLE_EDITOR)
	const isDiff = sidebar === ESidebar.CHATBOT && responseValue && prevValue

	return isDiff ? (
		<DiffEditor
			current={responseValue}
			previous={prevValue}
			className={className}
		/>
	) : (
		<Editor
			placeholder="Type..."
			autoFocus
			variant="aural"
			readOnly={!!simplifiedEditor || readOnly}
			className={className}
		/>
	)
}

export default EditorHandler

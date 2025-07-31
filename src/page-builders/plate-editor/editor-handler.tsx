import React, { useMemo } from 'react'
import useAIStore from '@/store/ai-store'
import usePlateStore from '@/store/plate-store'
import { useShallow } from 'zustand/react/shallow'

import { Editor } from '@/components/plate-ui-v2/editor'

import { ESidebar } from '@/types/plate-types'

import DiffEditor from './diff-editor'

const EditorHandler = ({ className }: { className?: string }) => {
	const { store } = usePlateStore()
	const { store: aiStore } = useAIStore()

	const sidebar = store(useShallow((state) => state.sidebar))
	const { responseValue, prevValue } = aiStore(
		useShallow((state) => ({
			responseValue: state.responseValue,
			prevValue: state.prevValue,
		}))
	)

	const isDiff = useMemo(
		() => sidebar === ESidebar.CHATBOT && responseValue && prevValue,
		[sidebar, responseValue, prevValue]
	)

	if (isDiff) {
		return (
			<DiffEditor
				current={responseValue}
				previous={prevValue}
				className={className}
			/>
		)
	}
	return (
		<Editor
			placeholder="Type..."
			autoFocus
			variant="aural"
			className={className}
		/>
	)
}

export default EditorHandler

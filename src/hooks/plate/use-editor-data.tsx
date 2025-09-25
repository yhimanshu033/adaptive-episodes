import React, { useMemo } from 'react'
import { useEditorSelector, useEditorState } from '@platejs/core/react'
import { useLocale } from 'next-intl'

import { prettifyNumber } from '@/lib/utils/helpers'

const useEditorDataUtil = () => {
	const editorText = useEditorSelector((editor) => {
		const blockPaths = editor.api.blocks({
			at: [],
		})
		// eslint-disable-next-line  @typescript-eslint/no-unused-vars
		const text = blockPaths.map(([_, path]) => editor.api.string(path))
		return text.join('\n')
	}, [])

	const locale = useLocale()
	const wordCount = useMemo(() => {
		const words = editorText
			.trim()
			.split(/\s+/)
			.filter((w) => !!w.length).length
		return { display: prettifyNumber(words, locale), value: words }
	}, [editorText, locale])

	const { children } = useEditorState()

	return {
		editorText,
		children,
		wordCount,
	}
}

const EditorDataContext = React.createContext<ReturnType<
	typeof useEditorDataUtil
> | null>(null)

export function EditorDataContextProvider({
	children,
}: React.PropsWithChildren) {
	const value = useEditorDataUtil()

	return (
		<EditorDataContext.Provider value={value}>
			{children}
		</EditorDataContext.Provider>
	)
}

export default function useEditorData() {
	const context = React.useContext(EditorDataContext)

	if (!context) {
		throw new Error(
			'useEditorData should be used inside EditorDataContextProvider'
		)
	}

	return context
}

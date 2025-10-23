import React, { useMemo } from 'react'
import { useEditorData } from 'unified-editor'

import {
	getPlaceholderContentFromTextOrValue,
	getText,
} from '@/lib/utils/plate'

import DiffEditor from '../diff-editor'

interface DiffDisplayProps {
	content?: string
	reverse?: boolean
}
export default function DiffDisplay({ content, reverse }: DiffDisplayProps) {
	const { children } = useEditorData()

	const episodeContent = useMemo(() => {
		return getPlaceholderContentFromTextOrValue(getText(children))
	}, [children])

	const propContent = useMemo(() => {
		return getPlaceholderContentFromTextOrValue(content)
	}, [content])

	const [currentContent, previousContent] = useMemo(() => {
		if (reverse) {
			return [propContent, episodeContent]
		}
		return [episodeContent, propContent]
	}, [reverse, episodeContent, propContent])

	return (
		<DiffEditor
			current={currentContent}
			previous={previousContent}
			readonly={true}
			className="bg-fm-surface-primary"
		/>
	)
}

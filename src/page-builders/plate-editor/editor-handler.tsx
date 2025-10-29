import React, { useEffect, useMemo } from 'react'
import useSavingCheck from '@/hooks/use-saving-check'
import useAIStore from '@/store/ai-store'
import usePlateStore from '@/store/plate-store'
import { useTheme } from 'next-themes'
import { useShallow } from 'zustand/react/shallow'

import { Editor } from '@/components/plate-ui-v2/editor'
import useConfiguration from '@/providers/configuration-provider'
import { cn } from '@/lib/aural-ui/utils'
import { scaleFontSizes } from '@/lib/utils/client-helpers'

import { ESidebar } from '@/types/plate-types'

import DiffEditor from './diff-editor'

const EditorHandler = ({ className }: { className?: string }) => {
	const { store } = usePlateStore()
	const { store: aiStore } = useAIStore()
	const { theme } = useTheme()
	const { configurationData } = useConfiguration()

	useSavingCheck()

	const sidebar = store(useShallow((state) => state.sidebar))
	const viewMode = store(useShallow((state) => state.viewMode))
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

	useEffect(() => {
		let scale = 1
		if (configurationData.zoomLevel === 'Fit') {
			const width = window.innerWidth - 64
			scale = width / 668
		} else {
			scale = configurationData.zoomLevel / 100
		}
		const editorScale = scale.toFixed(2)
		document.documentElement.style.setProperty('--editor-scale', editorScale)
		scaleFontSizes('copilot-editor')
	}, [configurationData.zoomLevel])

	const updatedClassname = useMemo(() => {
		return cn(className, {
			'bg-fm-surface-contrast text-fm-contrast selection:bg-fm-secondary!':
				theme === 'light',
		})
	}, [theme, className])

	if (isDiff) {
		return (
			<DiffEditor
				current={responseValue}
				previous={prevValue}
				className={updatedClassname}
			/>
		)
	}
	return (
		<Editor
			placeholder="Type..."
			autoFocus
			variant="aural"
			className={updatedClassname}
			readOnly={viewMode}
		/>
	)
}

export default EditorHandler

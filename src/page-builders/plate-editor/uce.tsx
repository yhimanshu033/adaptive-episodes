'use client'

import React from 'react'
import useEditorConfig from '@/hooks/use-editor-config'
import { SavingContextProvider } from '@/hooks/use-saving'
import { EditorSkeletonLoader } from '@/page-builders/plate-editor/editor-skelton-loader'
import EpisodeHeader from '@/page-builders/plate-editor/episode-header'
import SavingChecker from '@/page-builders/plate-editor/saving-checker'
import UnifiedCopilotEditorProvider from '@pocket-editor/features/unified-copilot-editor/provider'
import { DefaultEditor } from 'unified-editor'

const UCE = React.memo(() => {
	console.log('UCE')
	const { editorConfig } = useEditorConfig()

	console.log({ editorConfig })
	if (editorConfig?.contentConfig?.isLoading) {
		return <EditorSkeletonLoader />
	}

	return (
		<UnifiedCopilotEditorProvider config={editorConfig}>
			<Editor />
		</UnifiedCopilotEditorProvider>
	)
})
UCE.displayName = 'UCE'
export default UCE

const Editor = React.memo(() => {
	return (
		<div className="flex flex-col">
			<SavingContextProvider>
				<SavingChecker />
				<EpisodeHeader />
				<DefaultEditor />
			</SavingContextProvider>
		</div>
	)
})

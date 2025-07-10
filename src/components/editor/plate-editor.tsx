'use client'

import React from 'react'
import useEpisodeContent from '@/hooks/query/use-episode-content'
import useMyEditor from '@/hooks/use-my-editor'
import { SavingContextProvider } from '@/hooks/use-saving'
import EditorOverlayLoader from '@/page-builders/plate-editor/editor-overlay-loader'
import { EditorSkeletonLoader } from '@/page-builders/plate-editor/editor-skelton-loader'
import EpisodeHeader from '@/page-builders/plate-editor/episode-header'
import { Plate } from 'platejs/react'

import { Editor, EditorContainer } from '@/components/plate-ui-v2/editor'

import { SuggestionToolbarButton } from '../plate-ui-v2/suggestion-toolbar-button'
import { Toolbar } from '../plate-ui-v2/toolbar'

export function PlateEditor() {
	const {
		data: content,
		latestStatus = 'BASE',
		importedLocal,
	} = useEpisodeContent()

	const editor = useMyEditor({
		content: content?.text || '',
		id: 'root-editor',
	})

	if (!content) {
		return <EditorSkeletonLoader />
	}

	return (
		<Plate editor={editor}>
			<SavingContextProvider data={content} initialForceSave={importedLocal}>
				<div className="flex h-screen flex-col">
					<EditorOverlayLoader />
					<EpisodeHeader {...{ content, latestStatus }} />

					<Toolbar>
						<SuggestionToolbarButton />
					</Toolbar>
					<EditorContainer>
						<Editor variant="demo" placeholder="Type..." />
					</EditorContainer>
				</div>
			</SavingContextProvider>
		</Plate>
	)
}

export default PlateEditor

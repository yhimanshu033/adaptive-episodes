'use client'

import React from 'react'
import { useSearchParams } from 'next/navigation'
import { SIMPLIFIED_VIEWABLE_EDITOR } from '@/constants/global-constants'
import useEpisodeContent from '@/hooks/query/use-episode-content'
import useMyEditor from '@/hooks/use-my-editor'
import { SavingContextProvider } from '@/hooks/use-saving'
import EditorOverlayLoader from '@/page-builders/plate-editor/editor-overlay-loader'
import { EditorSkeletonLoader } from '@/page-builders/plate-editor/editor-skelton-loader'
import EpisodeHeader from '@/page-builders/plate-editor/episode-header'
import { Plate } from 'platejs/react'

import { Editor, EditorContainer } from '@/components/plate-ui-v2/editor'

import { ScrollArea } from '../aural-ui/scroll-area'
import { FixedToolbar } from '../plate-ui-v2/fixed-toolbar'

export function PlateEditor() {
	const {
		data: content,
		latestStatus = 'BASE',
		importedLocal,
	} = useEpisodeContent()

	const editor = useMyEditor({
		content: content?.text || '',
		id: 'root-editor',
		discussions: content?.chapter?.props?.comments,
	})

	const searchParams = useSearchParams()
	const simplifiedEditor = searchParams.get(SIMPLIFIED_VIEWABLE_EDITOR)

	if (!content) {
		return <EditorSkeletonLoader />
	}

	return (
		<Plate editor={editor}>
			<SavingContextProvider data={content} initialForceSave={importedLocal}>
				<div className="flex h-screen flex-col">
					<EditorOverlayLoader />
					<EpisodeHeader {...{ content, latestStatus }} />
					<EditorContainer>
						<ScrollArea className="max-h-[calc(100vh-152px)] overflow-y-auto">
							<Editor
								placeholder="Type..."
								autoFocus
								variant="aural"
								readOnly={!!simplifiedEditor}
							/>
						</ScrollArea>
					</EditorContainer>
				</div>
			</SavingContextProvider>
		</Plate>
	)
}

export default PlateEditor

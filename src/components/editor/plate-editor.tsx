'use client'

import React from 'react'
import useEpisodeContent from '@/hooks/query/use-episode-content'
import { SavingContextProvider } from '@/hooks/use-saving'
import EditorOverlayLoader from '@/page-builders/plate-editor/editor-overlay-loader'
import { EditorSkeletonLoader } from '@/page-builders/plate-editor/editor-skelton-loader'
import EpisodeHeader from '@/page-builders/plate-editor/episode-header'
import { Value } from 'platejs'
import { Plate, usePlateEditor } from 'platejs/react'

import { BasicNodesKit } from '@/components/editor/plugins/basic-nodes-kit'
import { Editor, EditorContainer } from '@/components/plate-ui-v2/editor'

import { SuggestionToolbarButton } from '../plate-ui-v2/suggestion-toolbar-button'
import { Toolbar } from '../plate-ui-v2/toolbar'
import { CommentKit } from './plugins/comment-kit'
import { useCreateDiscussionKit } from './plugins/discussion-kit'
import { useSuggestionPlugin } from './plugins/suggestion-kit'

export function PlateEditor() {
	const {
		data: content,
		latestStatus = 'BASE',
		importedLocal,
	} = useEpisodeContent()

	const discussionPlugin = useCreateDiscussionKit()
	const suggestionPlugin = useSuggestionPlugin()

	const value = content?.text ? (JSON.parse(content.text) as Value) : ''

	const editor = usePlateEditor(
		{
			plugins: [
				...BasicNodesKit,
				suggestionPlugin,
				...CommentKit,
				discussionPlugin,
			],
			value,
			id: 'editor',
		},
		[value]
	)

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

'use client'

import React from 'react'
import useEpisodeContent from '@/hooks/query/use-episode-content'
import { EditorSkeletonLoader } from '@/page-builders/plate-editor/editor-skelton-loader'
import { Value } from 'platejs'
import { Plate, usePlateEditor } from 'platejs/react'

import { BasicNodesKit } from '@/components/editor/plugins/basic-nodes-kit'
import { Editor, EditorContainer } from '@/components/plate-ui-v2/editor'

import { SuggestionToolbarButton } from '../plate-ui-v2/suggestion-toolbar-button'
import { Toolbar } from '../plate-ui-v2/toolbar'
import { CommentKit } from './plugins/comment-kit'
import { DiscussionKit } from './plugins/discussion-kit'
import { SuggestionKit } from './plugins/suggestion-kit'

export function PlateEditor() {
	const { data: content } = useEpisodeContent()

	const value = content?.text ? (JSON.parse(content.text) as Value) : ''

	const editor = usePlateEditor(
		{
			plugins: [
				...BasicNodesKit,
				...SuggestionKit,
				...CommentKit,
				...DiscussionKit,
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
			<Toolbar>
				<SuggestionToolbarButton />
			</Toolbar>
			<EditorContainer>
				<Editor variant="demo" placeholder="Type..." />
			</EditorContainer>
		</Plate>
	)
}

export default PlateEditor

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
'use client'

import { Value } from 'platejs'
import { usePlateEditor } from 'platejs/react'

import { BasicNodesKit } from '@/components/editor/plugins/basic-nodes-kit'
import { CommentKit } from '@/components/editor/plugins/comment-kit'
import { useCreateDiscussionKit } from '@/components/editor/plugins/discussion-kit'
import { useSuggestionPlugin } from '@/components/editor/plugins/suggestion-kit'

const useMyEditor = ({
	content,
	id = 'plate-editor',
}: {
	content: string
	id?: string
	simplified?: boolean
}) => {
	const discussionPlugin = useCreateDiscussionKit()
	const suggestionPlugin = useSuggestionPlugin()

	const value = content ? (JSON.parse(content) as Value) : ''
	const editor = usePlateEditor(
		{
			plugins: [
				...BasicNodesKit,
				...CommentKit,
				suggestionPlugin,
				discussionPlugin,
			],
			value,
			id,
		},
		[value]
	)

	return editor
}

export default useMyEditor

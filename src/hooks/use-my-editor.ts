/* eslint-disable @typescript-eslint/no-unsafe-assignment */
'use client'

import { TrailingBlockPlugin, Value } from 'platejs'
import { usePlateEditor } from 'platejs/react'

import { AlignKit } from '@/components/editor/plugins/align-kit'
import { AutoformatKit } from '@/components/editor/plugins/autoformat-kit'
import { BasicNodesKit } from '@/components/editor/plugins/basic-nodes-kit'
import { CommentKit } from '@/components/editor/plugins/comment-kit'
import {
	discussionPlugin,
	TDiscussion,
} from '@/components/editor/plugins/discussion-kit'
import { ExitBreakKit } from '@/components/editor/plugins/exit-break-kit'
import { FixedToolbarKit } from '@/components/editor/plugins/fixed-toolbar-kit'
import { FloatingToolbarKit } from '@/components/editor/plugins/floating-toolbar-kit'
import { FontKit } from '@/components/editor/plugins/font-kit'
import { LineHeightKit } from '@/components/editor/plugins/line-height-kit'
import {
	SuggestionKit,
	suggestionPlugin,
} from '@/components/editor/plugins/suggestion-kit'
import { BlockDiscussion } from '@/components/plate-ui-v2/block-discussion'
import useProjectId from '@/providers/project-id-provider'

const useMyEditor = ({
	content,
	id = 'plate-editor',
	discussions = [],
}: {
	content: string
	discussions?: TDiscussion[]
	id?: string
	simplified?: boolean
}) => {
	const {
		users,
		me: { user: userData },
	} = useProjectId()

	if (content) {
		console.log(JSON.parse(content))
	}

	const value = content ? (JSON.parse(content) as Value) : ''
	const editor = usePlateEditor(
		{
			plugins: [
				// Marks
				...BasicNodesKit,
				...FontKit,

				// Block Style
				...AlignKit,
				...LineHeightKit,

				// Collaboration
				...SuggestionKit,
				discussionPlugin.configure({
					options: {
						currentUserId: String(userData?.user.id),
						discussions,
						users,
					},
					render: {
						aboveNodes: BlockDiscussion,
					},
				}),
				...CommentKit,

				// Editing
				...AutoformatKit,
				...ExitBreakKit,
				TrailingBlockPlugin,

				// UI
				...FloatingToolbarKit,
			],
			value,
			id,
		},
		[value, users, userData?.user.id, discussions, id]
	)

	return editor
}

export default useMyEditor

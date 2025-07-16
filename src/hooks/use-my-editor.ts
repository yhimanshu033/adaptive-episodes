/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
'use client'

import { useMemo } from 'react'
import { AIChatPlugin } from '@platejs/ai/react'
import { TrailingBlockPlugin, Value } from 'platejs'
import { usePlateEditor } from 'platejs/react'

import { AIKit } from '@/components/editor/plugins/ai-kit'
import { AlignKit } from '@/components/editor/plugins/align-kit'
import { AutoformatKit } from '@/components/editor/plugins/autoformat-kit'
import { BasicNodesKit } from '@/components/editor/plugins/basic-nodes-kit'
import { BlockMenuKit } from '@/components/editor/plugins/block-menu-kit'
import { CommentKit } from '@/components/editor/plugins/comment-kit'
import { discussionPlugin } from '@/components/editor/plugins/discussion-kit'
import { DndKit } from '@/components/editor/plugins/dnd-kit'
import { ExitBreakKit } from '@/components/editor/plugins/exit-break-kit'
import { FloatingToolbarKit } from '@/components/editor/plugins/floating-toolbar-kit'
import { FontKit } from '@/components/editor/plugins/font-kit'
import { LineHeightKit } from '@/components/editor/plugins/line-height-kit'
import { suggestionPlugin } from '@/components/editor/plugins/suggestion-kit'
import { BlockDiscussion } from '@/components/plate-ui-v2/block-discussion'
import {
	SuggestionLeaf,
	SuggestionLineBreak,
} from '@/components/plate-ui-v2/suggestion-node'
import useProjectId from '@/providers/project-id-provider'
import { migrateOldComments } from '@/lib/plate/migrateOldComments'
import { migrateOldSuggestions } from '@/lib/plate/migrateOldSuggestions'

import { TCommentGeneric } from '@/types/plate-types'

const useMyEditor = ({
	content,
	id = 'plate-editor',
	comments = [],
}: {
	comments?: TCommentGeneric[]
	content: string
	id?: string
	simplified?: boolean
}) => {
	const {
		users,
		me: { user: userData },
	} = useProjectId()

	const value = useMemo(
		() => (content ? migrateOldSuggestions(JSON.parse(content) as Value) : ''),
		[content]
	)
	const discussions = migrateOldComments(comments, value)

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
				suggestionPlugin.configure({
					options: {
						currentUserId: String(userData?.user.id),
					},
					render: {
						node: SuggestionLeaf,
						belowNodes: SuggestionLineBreak as any,
					},
				}),

				// Editing
				...AutoformatKit,
				...ExitBreakKit,
				TrailingBlockPlugin,

				// UI
				...FloatingToolbarKit,

				// AI
				...AIKit,
				...BlockMenuKit,
				AIChatPlugin,

				...DndKit,
			],
			value,
			id,
		},
		[value, users, userData?.user.id, discussions, id]
	)

	return editor
}

export default useMyEditor

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
'use client'

import { useMemo } from 'react'
import { DEFAULT_EDITOR_CONTENT } from '@/constants/editor-constants'
import { TrailingBlockPlugin, Value } from 'platejs'
import { usePlateEditor } from 'platejs/react'

import { AlignKit } from '@/components/editor/plugins/align-kit'
import { AutoformatKit } from '@/components/editor/plugins/autoformat-kit'
import { BasicNodesKit } from '@/components/editor/plugins/basic-nodes-kit'
import { CommentKit } from '@/components/editor/plugins/comment-kit'
import { discussionPlugin } from '@/components/editor/plugins/discussion-kit'
import { DocxKit } from '@/components/editor/plugins/docx-kit'
import { ExitBreakKit } from '@/components/editor/plugins/exit-break-kit'
import { FindAndReplaceKit } from '@/components/editor/plugins/find-and-replace-kit'
import { FloatingToolbarKit } from '@/components/editor/plugins/floating-toolbar-kit'
import { FontKit } from '@/components/editor/plugins/font-kit'
import { LaserKit } from '@/components/editor/plugins/laser-kit'
import { LaserPromptKit } from '@/components/editor/plugins/laser-prompt-kit'
import { LineHeightKit } from '@/components/editor/plugins/line-height-kit'
import { suggestionPlugin } from '@/components/editor/plugins/suggestion-kit'
import {
	SuggestionLeaf,
	SuggestionLineBreak,
} from '@/components/plate-ui-v2/suggestion-node'
import { SuggestionRenderer } from '@/components/plate-ui-v2/suggestion-renderer'
import useProjectId from '@/providers/project-id-provider'
import { migrateOldComments } from '@/lib/plate/migrateOldComments'
import { migrateOldSuggestions } from '@/lib/plate/migrateOldSuggestions'
import { breakDownValue, jsonify } from '@/lib/utils/plate'

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

	const value = useMemo(() => {
		if (!content) {
			return DEFAULT_EDITOR_CONTENT
		}
		try {
			return migrateOldSuggestions(JSON.parse(content) as Value)
		} catch {
			return breakDownValue(jsonify(content))
		}
	}, [content])

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
						aboveNodes: SuggestionRenderer,
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
				...FindAndReplaceKit,

				// UI
				...FloatingToolbarKit,

				//Parsers
				...DocxKit,

				//laser
				...LaserKit,
				...LaserPromptKit,
			],
			value,
			id,
		},
		[value, users, userData?.user.id, discussions, id]
	)

	return editor
}

export default useMyEditor

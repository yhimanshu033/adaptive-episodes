import React from 'react'
import { cn } from '@udecode/cn'
import { Range } from '@udecode/plate'
import { TCommentText } from '@udecode/plate-comments'
import {
	useComment,
	useCommentDeleteButton,
	useCommentDeleteButtonState,
} from '@udecode/plate-comments/react'
import { useEditorRef } from '@udecode/plate-common/react'
import { Replace } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { getText } from '@/lib/utils/plate'

const CommentReplaceButton = () => {
	const comment = useComment()
	const editor = useEditorRef()

	const deleteButtonState = useCommentDeleteButtonState()
	const { props: deleteProps } = useCommentDeleteButton(deleteButtonState)

	const findNodes = (id: string) => {
		return Array.from(
			editor.nodes<TCommentText>({
				at: [],
				match: (node) => `comment_${id}` in node,
			})
		)
	}

	const handleReplaceComment = () => {
		if (!comment) {
			return
		}

		const nodeEntries = findNodes(comment.id)
		if (!nodeEntries.length) {
			return
		}

		const firstEntry = nodeEntries[0]
		const lastEntry = nodeEntries[nodeEntries.length - 1]

		const range: Range = {
			anchor: { path: firstEntry[1], offset: 0 },
			focus: {
				path: lastEntry[1],
				offset: lastEntry[0].text.length,
			},
		}

		editor.select(range)
		editor.delete({ at: range })
		editor.insertText(getText(comment.value), { at: range })
		deleteProps?.onClick()
	}

	if (!comment) {
		return null
	}
	return (
		<Button
			variant="ghost"
			tooltip="Replace"
			className={cn('text-muted-foreground h-6 p-1')}
			onClick={handleReplaceComment}
		>
			<Replace className="size-4" />
		</Button>
	)
}

export default CommentReplaceButton

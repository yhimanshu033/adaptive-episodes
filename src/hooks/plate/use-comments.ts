import { useCallback } from 'react'
import {
	BaseCommentsPlugin,
	getCommentKey,
	getCommentNodeEntries,
	TComment,
} from '@udecode/plate-comments'
import { CommentsPlugin } from '@udecode/plate-comments/react'
import { someNode } from '@udecode/plate-common'
import { useEditorPlugin, useEditorRef } from '@udecode/plate-common/react'

import { TCustomComment } from '@/types/editor-types'

export default function useComments() {
	const { useOption, setOptions } = useEditorPlugin(CommentsPlugin)
	const editor = useEditorRef()
	const allComments: TComment[] = Object.values(useOption('comments'))
	const activeCommentId = useOption('activeCommentId')

	const replies = allComments.filter((elm) => !!elm.parentId)

	const comments: (TComment & { replies: TComment[] })[] = allComments
		.filter((elm) => !elm.parentId)
		.map((elm) => ({ ...elm, replies: [] }))

	comments.forEach((comment) => {
		comment.replies = replies.filter((reply) => reply.parentId === comment.id)
	})

	const nodes = getCommentNodeEntries(editor)

	const sortedComments: TCustomComment[] = nodes
		.filter(([node]) => node.comment)
		.map(([node]) => {
			const comment = comments.find((comment) =>
				Object.keys(node).includes(getCommentKey(comment.id))
			)
			if (comment) {
				return { ...comment, node }
			}
		})
		.filter((comment) => !!comment)
		.reduce((uniqueComments, comment) => {
			if (
				!uniqueComments.some((uniqueComment) => uniqueComment.id === comment.id)
			) {
				uniqueComments.push(comment)
			}
			return uniqueComments
		}, [] as TCustomComment[])

	const resetActiveComments = useCallback(() => {
		if (!someNode(editor, { match: (n) => n[BaseCommentsPlugin.key] })) {
			setOptions({ activeCommentId: null })
		}
	}, [editor, setOptions])

	const commentExists = comments.find(
		(comment) => comment.id === activeCommentId
	)

	return {
		allComments,
		comments,
		replies,
		get: useOption,
		sortedComments,
		set: setOptions,
		resetActiveComments,
		activeCommentId,
		commentExists,
	}
}

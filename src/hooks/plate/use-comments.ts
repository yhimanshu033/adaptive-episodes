import {
	getCommentKey,
	getCommentNodeEntries,
	TComment,
} from '@udecode/plate-comments'
import { CommentsPlugin } from '@udecode/plate-comments/react'
import { useEditorPlugin, useEditorRef } from '@udecode/plate-common/react'

export default function useComments() {
	const { useOption, setOptions } = useEditorPlugin(CommentsPlugin)
	const editor = useEditorRef()
	const allComments: TComment[] = Object.values(useOption('comments'))

	const replies = allComments.filter((elm) => !!elm.parentId)

	const comments: (TComment & { replies: TComment[] })[] = allComments
		.filter((elm) => !elm.parentId)
		.map((elm) => ({ ...elm, replies: [] }))

	comments.forEach((comment) => {
		comment.replies = replies.filter((reply) => reply.parentId === comment.id)
	})

	const nodes = getCommentNodeEntries(editor)

	const sortedComments: TComment[] = nodes
		.filter(([node]) => node.comment)
		.map(([node]) => {
			const comment = comments.find((comment) =>
				Object.keys(node).includes(getCommentKey(comment.id))
			)
			if (comment) {
				return comment
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
		}, [] as TComment[])

	return {
		allComments,
		comments,
		replies,
		get: useOption,
		sortedComments,
		set: setOptions,
	}
}

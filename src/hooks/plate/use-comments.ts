import { TComment } from '@udecode/plate-comments'
import { CommentsPlugin } from '@udecode/plate-comments/react'
import { useEditorPlugin } from '@udecode/plate-common/react'

export default function useComments() {
	const { useOption } = useEditorPlugin(CommentsPlugin)
	const allComments: TComment[] = Object.values(useOption('comments'))

	const replies = allComments.filter((elm) => !!elm.parentId)

	const comments: (TComment & { replies: TComment[] })[] = allComments
		.filter((elm) => !elm.parentId)
		.map((elm) => ({ ...elm, replies: [] }))

	comments.forEach((comment) => {
		comment.replies = replies.filter((reply) => reply.parentId === comment.id)
	})

	return { allComments, comments, replies, get: useOption }
}

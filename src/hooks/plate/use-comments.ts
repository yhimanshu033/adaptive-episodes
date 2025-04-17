import { useCallback } from 'react'
import {
	BaseCommentsPlugin,
	getCommentKey,
	getCommentNodeEntries,
	TComment,
	TCommentText,
} from '@udecode/plate-comments'
import { CommentsPlugin } from '@udecode/plate-comments/react'
import { someNode } from '@udecode/plate-common'
import {
	useEditorPlugin,
	useEditorRef,
	useEditorState,
} from '@udecode/plate-common/react'

import { addUnresolvedCommentInChildren } from '@/lib/utils/plate'

import { TCustomComment } from '@/types/editor-types'

export default function useComments() {
	const { useOption, setOptions } = useEditorPlugin(CommentsPlugin)
	const editor = useEditorRef()
	const commentsOption = useOption('comments')

	const allComments: TComment[] = commentsOption
		? Object.values(commentsOption)
		: []
	const activeCommentId = useOption('activeCommentId')

	const replies = allComments.filter((elm) => !!elm.parentId)

	const comments: (TComment & { replies: TComment[] })[] = allComments
		.filter((elm) => !elm.parentId)
		.map((elm) => ({ ...elm, replies: [] }))

	comments.forEach((comment) => {
		comment.replies = replies.filter((reply) => reply.parentId === comment.id)
	})

	const nodes = getCommentNodeEntries(editor)

	const { children, tf } = useEditorState()

	const sortedComments: TCustomComment[] = (nodes as TCommentText[][])
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
			setOptions({ activeComment: () => null })
			editor.getApi(CommentsPlugin).comment.resetNewCommentValue()
		}
	}, [editor, setOptions])

	const commentExists = comments.find(
		(comment) => comment.id === activeCommentId
	)

	const isCommented = (id: string) => {
		return sortedComments.some((comment) => comment.id === id)
	}

	const addComment = useCallback(
		(comment: TCustomComment) => {
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const { node: _node, ...rest } = comment
			const newChildren = addUnresolvedCommentInChildren(
				children,
				comment,
				CommentsPlugin.key
			)
			tf.setValue(newChildren)
			setOptions({
				comments: { ...commentsOption, [comment.id]: rest },
			})
		},
		[children, setOptions, tf, commentsOption]
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
		isCommented,
		addComment,
	}
}

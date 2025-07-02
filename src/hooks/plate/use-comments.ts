import { useCallback, useMemo } from 'react'
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

	// Memoize nodes to prevent unnecessary recalculations
	const nodes = useMemo(() => getCommentNodeEntries(editor), [editor])

	const { children, tf } = useEditorState()

	const allComments: TComment[] = useMemo(
		() => (commentsOption ? Object.values(commentsOption) : []),
		[commentsOption]
	)

	const activeCommentId = useOption('activeCommentId')

	const replies = useMemo(
		() => allComments.filter((elm) => !!elm.parentId),
		[allComments]
	)

	const comments: (TComment & { replies: TComment[] })[] = useMemo(
		() =>
			allComments
				.filter((elm) => !elm.parentId)
				.map((elm) => ({
					...elm,
					replies: replies.filter((reply) => reply.parentId === elm.id),
				})),
		[allComments, replies]
	)

	// Create a comment lookup map for O(1) access instead of O(n) find operations
	const commentMap = useMemo(() => {
		const map = new Map<string, TComment & { replies: TComment[] }>()
		comments.forEach((comment) => {
			map.set(getCommentKey(comment.id), comment)
		})
		return map
	}, [comments])

	// Optimized sortedComments with better algorithm complexity
	const sortedComments: TCustomComment[] = useMemo(() => {
		const seenComments = new Set<string>()
		const result: TCustomComment[] = []

		for (const [node] of nodes as TCommentText[][]) {
			if (!node.comment) {
				continue
			}

			// Use for...in for better performance than Object.keys()
			for (const key in node) {
				const comment = commentMap.get(key)
				if (comment && !seenComments.has(comment.id)) {
					seenComments.add(comment.id)
					result.push({ ...comment, node })
					break // Exit inner loop once comment is found
				}
			}
		}

		return result
	}, [nodes, commentMap])

	const resetActiveComments = useCallback(() => {
		if (!someNode(editor, { match: (n) => n[BaseCommentsPlugin.key] })) {
			setOptions({ activeCommentId: null })
			setOptions({ activeComment: () => null })
			editor.getApi(CommentsPlugin).comment.resetNewCommentValue()
		}
	}, [editor, setOptions])

	const commentExists = useMemo(
		() => comments.find((comment) => comment.id === activeCommentId),
		[activeCommentId, comments]
	)

	// Optimized isCommented using Set for O(1) lookup
	const commentIdSet = useMemo(
		() => new Set(sortedComments.map((comment) => comment.id)),
		[sortedComments]
	)

	const isCommented = useCallback(
		(id: string) => commentIdSet.has(id),
		[commentIdSet]
	)

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

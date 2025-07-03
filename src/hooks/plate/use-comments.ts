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
import { useEditorPlugin, useEditorRef } from '@udecode/plate-common/react'

import useResolvedComments from '@/lib/plate/plugins/resolved-comments/use-resolved-comments'
import {
	addUnresolvedCommentInChildren,
	sortCommentsAndDescriptions,
} from '@/lib/utils/plate'

import { TCustomComment, TReview } from '@/types/editor-types'

import useSuggestions from './use-suggestions'

// Custom hook that only subscribes to comment-related state
const useCommentEditorState = () => {
	const editor = useEditorRef()

	// Subscribe only to comment-related changes
	const commentsOption = editor.useOption(CommentsPlugin, 'comments')
	const activeCommentId = editor.useOption(CommentsPlugin, 'activeCommentId')

	return {
		editor,
		children: editor.children,
		tf: editor.tf,
		commentsOption,
		activeCommentId,
	}
}

export default function useComments() {
	const { useOption, setOptions } = useEditorPlugin(CommentsPlugin)
	const { editor, children, tf, commentsOption, activeCommentId } =
		useCommentEditorState()
	const { descriptions } = useSuggestions()
	const { resolvedComments } = useResolvedComments()

	// Memoize nodes to prevent unnecessary recalculations
	const nodes = getCommentNodeEntries(editor)

	const allComments: TComment[] = commentsOption
		? Object.values(commentsOption)
		: []

	const replies = allComments.filter((elm) => !!elm.parentId)

	const comments: (TComment & { replies: TComment[] })[] = allComments
		.filter((elm) => !elm.parentId)
		.map((elm) => ({
			...elm,
			replies: replies.filter((reply) => reply.parentId === elm.id),
		}))

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

	const setActiveComment = useCallback(
		(comment: TCustomComment) => {
			editor.setOption(BaseCommentsPlugin, 'activeCommentId', comment.id)
		},
		[editor]
	)

	// Memoize unresolved comments filtering
	const unresolvedComments = useMemo(
		() => [...sortedComments].filter((comment) => !comment.isResolved),
		[sortedComments]
	)

	// Memoize comments and descriptions sorting - remove editor.children dependency
	const commentsAndDescriptions: TReview[] = useMemo(
		() =>
			sortCommentsAndDescriptions(
				editor.children,
				unresolvedComments,
				descriptions
			),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[unresolvedComments, descriptions] // Removed editor.children to prevent re-renders on content changes
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
		setActiveComment,
		resolvedComments,
		commentsAndDescriptions,
	}
}

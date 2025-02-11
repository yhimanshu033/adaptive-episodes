import { useCallback } from 'react'
import usePlateStore from '@/store/plate-store'
import { CommentsPlugin } from '@udecode/plate-comments/react'
import { useEditorPlugin, useEditorState } from '@udecode/plate-common/react'

import { ResolvedCommentsPlugin } from '@/lib/plate/plugins/resolved-comments'
import {
	addResolvedCommentInChildren,
	addUnresolvedCommentInChildren,
} from '@/lib/utils/plate'

import { TCustomComment } from '@/types/editor-types'
import { ESidebar } from '@/types/plate-types'

export default function useResolvedComments() {
	const { setOptions, useOption } = useEditorPlugin(ResolvedCommentsPlugin)
	const resolvedComments = useOption('resolvedComments')
	const activeResolvedCommentId = useOption('activeResolvedCommentId')

	const { store, setResolved, setSidebar } = usePlateStore()
	const showResolved = store((state) => state.resolved)
	const sidebar = store((state) => state.sidebar)

	const { useOption: useCommentOption } = useEditorPlugin(CommentsPlugin)

	const users = useCommentOption('users')

	const { children, tf } = useEditorState()

	function addResolvedComment(comment: TCustomComment) {
		setOptions({ resolvedComments: [...resolvedComments, comment] })
		const newChildren = addResolvedCommentInChildren(
			children,
			comment,
			ResolvedCommentsPlugin.key
		)
		tf.setValue(newChildren)
	}

	function removeResolvedComment(comment: TCustomComment) {
		setOptions({
			resolvedComments: resolvedComments.filter(
				(item) => item.id !== comment.id
			),
		})
	}

	function deleteResolvedComment(comment: TCustomComment) {
		removeResolvedComment(comment)
		const newChildren = addUnresolvedCommentInChildren(children, comment)
		tf.setValue(newChildren)
	}

	function getUser(id: string) {
		return users[id]
	}

	function makeResolvedCommentActive(id: string) {
		setOptions({ activeResolvedCommentId: id })
		setResolved(true)
		setSidebar(ESidebar.COMMENTS)
	}

	const isActive = useCallback(
		(id: string) =>
			id === activeResolvedCommentId &&
			sidebar === ESidebar.COMMENTS &&
			showResolved,
		[activeResolvedCommentId, sidebar, showResolved]
	)

	return {
		addResolvedComment,
		resolvedComments,
		users,
		activeResolvedCommentId,
		getUser,
		makeResolvedCommentActive,
		isActive,
		removeResolvedComment,
		deleteResolvedComment,
	}
}

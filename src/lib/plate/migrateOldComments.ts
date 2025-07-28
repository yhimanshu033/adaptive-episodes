'use client'

import { Descendant, nanoid, Value } from 'platejs'

import { TDiscussion } from '@/components/editor/plugins/discussion-kit'

import { TCommentGeneric, TOldComment } from '@/types/plate-types'

function findCommentText(
	discussionId: string,
	value: Value
): string | undefined {
	const key = `comment_${discussionId}`

	for (const node of value) {
		const text = findInNode(node, key)
		if (text) {
			return text
		}
	}

	return undefined
}

function findInNode(node: Descendant, key: string): string | undefined {
	// Base case: text node
	if ('text' in node && node[key] === true) {
		return node.text as string
	}

	// Recursive case: element with children
	if ('children' in node && Array.isArray(node.children)) {
		for (const child of node.children as Descendant[]) {
			const result = findInNode(child, key)
			if (result) {
				return result
			}
		}
	}

	return undefined
}

function addId(content: Value): Value {
	return content.map((el) => ({
		id: el.id || nanoid(),
		...el,
	}))
}

function isOldComment(comment: TCommentGeneric): comment is TOldComment {
	return 'value' in comment && Array.isArray(comment.value)
}

export const migrateOldComments = (
	allComments: TCommentGeneric[],
	editorState: Value | string | null
): TDiscussion[] => {
	if (!editorState || typeof editorState === 'string') {
		return []
	}
	const oldComments = allComments.filter(isOldComment)
	const newDiscussions = allComments.filter(
		(c): c is TDiscussion => !isOldComment(c)
	)

	const comments = oldComments.filter((c) => !c.parentId)
	const replies = oldComments.filter((c) => c.parentId)
	const discussionGroup: Record<string, TDiscussion> = {}

	for (const comment of comments) {
		const discussionId = comment.id
		const documentContent =
			findCommentText(discussionId, editorState) || 'Not found'

		discussionGroup[discussionId] = {
			id: discussionId,
			createdAt: new Date(comment.createdAt),
			userId: comment.userId,
			isResolved: false,
			documentContent,
			comments: [
				{
					id: nanoid(),
					userId: comment.userId,
					createdAt: new Date(comment.createdAt),
					isEdited: false,
					contentRich: addId(comment.value),
					discussionId,
				},
			],
		}
	}

	for (const reply of replies) {
		const parent = discussionGroup[reply.parentId!]
		if (!parent) {
			continue
		}

		parent.comments.push({
			id: nanoid(),
			userId: reply.userId,
			createdAt: new Date(reply.createdAt),
			isEdited: false,
			contentRich: addId(reply.value),
			discussionId: reply.parentId!,
		})
	}

	return [...Object.values(discussionGroup), ...newDiscussions]
}

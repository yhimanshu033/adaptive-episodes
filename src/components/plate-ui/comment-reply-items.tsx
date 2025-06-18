'use client'

import React from 'react'
import {
	SCOPE_ACTIVE_COMMENT,
	useCommentReplies,
} from '@udecode/plate-comments/react'

import { CommentItem } from '@/components/plate-ui/comment-item'

import { Divider } from '../aural-ui/divider'

export function CommentReplyItems() {
	const commentReplies = useCommentReplies(SCOPE_ACTIVE_COMMENT)

	return (
		<>
			{Object.keys(commentReplies).map((id) => (
				<div key={`comment-replies-${id}`} className="flex flex-col gap-4">
					<Divider variant="secondary" />
					<CommentItem key={id} commentId={id} />
				</div>
			))}
		</>
	)
}

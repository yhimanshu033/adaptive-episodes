'use client'

import React from 'react'
import { CommentProvider, CommentsPlugin } from '@udecode/plate-comments/react'
import { useEditorPlugin } from '@udecode/plate-common/react'

import CommentItemContent from '@/components/plate-ui/comment-item-content'

type PlateCommentProps = {
	commentId: string
}

export function CommentItem({ commentId }: PlateCommentProps) {
	const { useOption } = useEditorPlugin(CommentsPlugin)
	const comment = useOption('commentById', commentId)

	if (!comment) return null

	return (
		<CommentProvider id={commentId} key={commentId}>
			<CommentItemContent />
		</CommentProvider>
	)
}

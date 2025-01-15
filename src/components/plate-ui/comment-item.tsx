'use client'

import React, { useMemo } from 'react'
import { AI_USER_ID } from '@/constants/ai-constants'
import useCommentExampleHook from '@/hooks/mutation/use-comment-example-hook'
import useSocketStreaming from '@/hooks/use-socket-streaming'
import {
	CommentProvider,
	CommentsPlugin,
	useCommentItemContentState,
} from '@udecode/plate-comments/react'
import { useEditorPlugin } from '@udecode/plate-common/react'
import { formatDistance } from 'date-fns'

import { CommentAvatar } from './comment-avatar'
import { CommentMoreDropdown } from './comment-more-dropdown'
import { CommentResolveButton } from './comment-resolve-button'
import { CommentValue } from './comment-value'

type PlateCommentProps = {
	commentId: string
}

function CommentItemContent() {
	const { comment, commentText, editingValue, isReplyComment, user } =
		useCommentItemContentState()

	const { responses, taskEnded } = useSocketStreaming()
	const { mutate, data } = useCommentExampleHook()

	const exampleData = useMemo(() => {
		if (user?.id !== AI_USER_ID || !data) {
			return null
		}
		return responses[data]?.join('') || ''
	}, [data, responses, user])

	return (
		<div>
			<div className="relative flex items-center gap-2">
				<CommentAvatar userId={comment.userId} />

				<h4 className="text-sm font-semibold leading-none">{user?.name}</h4>

				<div className="text-xs leading-none text-muted-foreground">
					{formatDistance(comment.createdAt, Date.now())} ago
				</div>

				<div className="absolute -right-0.5 -top-0.5 flex space-x-1">
					{isReplyComment ? null : <CommentResolveButton />}

					<CommentMoreDropdown onExample={() => mutate()} />
				</div>
			</div>

			<div className="mb-4 pl-7 pt-0.5">
				{editingValue ? (
					<CommentValue />
				) : (
					<div className="whitespace-pre-wrap text-sm">{commentText}</div>
				)}
			</div>
			{data && !exampleData && (
				<div className="flex flex-col gap-2 p-2">
					<h2 className="font-semibold">Denke nach...</h2>
				</div>
			)}
			{exampleData && data && !taskEnded[data] && (
				<div className="flex flex-col gap-2 p-2">
					<h2 className="text-sm font-semibold">Beispiel:</h2>
					<p className="text-xs">{exampleData}</p>
				</div>
			)}
		</div>
	)
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

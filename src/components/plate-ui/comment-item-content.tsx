'use client'

import React, { useMemo } from 'react'
import { AI_USER_ID } from '@/constants/ai-constants'
import useCommentExampleHook from '@/hooks/mutation/use-comment-example-hook'
import useSocketStreaming from '@/hooks/use-socket-streaming'
import useAIStore from '@/store/ai-store'
import { useCommentItemContentState } from '@udecode/plate-comments/react'
import { formatDistance } from 'date-fns'
import { useShallow } from 'zustand/react/shallow'

import { CommentAvatar } from '@/components/plate-ui/comment-avatar'
import { CommentMoreDropdown } from '@/components/plate-ui/comment-more-dropdown'
import { CommentResolveButton } from '@/components/plate-ui/comment-resolve-button'
import { CommentValue } from '@/components/plate-ui/comment-value'

export default function CommentItemContent() {
	const { comment, commentText, editingValue, isReplyComment, user } =
		useCommentItemContentState()

	const { store, addActiveCommentExampleMap } = useAIStore()
	const activeCommentExampleMap = store(
		useShallow((state) => state.activeCommentExampleMap)
	)
	const { responses, taskEnded } = useSocketStreaming()
	const { mutateAsync, data } = useCommentExampleHook()

	const key = useMemo(
		() => data || activeCommentExampleMap[comment.id] || '',
		[data, activeCommentExampleMap, comment.id]
	)
	const exampleData = useMemo(() => {
		if (user?.id !== AI_USER_ID || !key) {
			return null
		}
		return responses[key]?.join('') || ''
	}, [key, user, responses])

	async function onExample() {
		const taskId = await mutateAsync()
		addActiveCommentExampleMap({ key: comment.id, value: taskId })
	}

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

					<CommentMoreDropdown onExample={() => void onExample()} />
				</div>
			</div>

			<div className="mb-4 pl-7 pt-0.5">
				{editingValue ? (
					<CommentValue />
				) : (
					<div className="whitespace-pre-wrap text-sm">{commentText}</div>
				)}
			</div>
			{!exampleData && key && (
				<div className="flex flex-col gap-2 p-2">
					<h2 className="font-semibold">Denke nach...</h2>
				</div>
			)}
			{exampleData && !taskEnded[key] && (
				<div className="flex flex-col gap-2 p-2">
					<h2 className="text-sm font-semibold">Beispiel:</h2>
					<p className="text-xs">{exampleData}</p>
				</div>
			)}
		</div>
	)
}

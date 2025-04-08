'use client'

import React, { useMemo } from 'react'
import { AI_USER_ID } from '@/constants/ai-constants'
import { roleToData } from '@/constants/global-constants'
import useCommentExampleHook from '@/hooks/mutation/use-comment-example-hook'
import useSocketStreaming from '@/hooks/use-socket-streaming'
import useAIStore from '@/store/ai-store'
import usePlateStore from '@/store/plate-store'
import { useCommentItemContentState } from '@udecode/plate-comments/react'
import { useEditorReadOnly } from '@udecode/plate-common/react'
import { formatDistance } from 'date-fns'
import { Copy } from 'lucide-react'
import { useShallow } from 'zustand/react/shallow'

import IfElse, { If } from '@/components/if-else'
import { CommentAvatar } from '@/components/plate-ui/comment-avatar'
import { CommentMoreDropdown } from '@/components/plate-ui/comment-more-dropdown'
import { CommentResolveButton } from '@/components/plate-ui/comment-resolve-button'
import { CommentValue } from '@/components/plate-ui/comment-value'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

import { PlateUser } from '@/types/plate-types'

export default function CommentItemContent() {
	const {
		comment,
		commentText,
		editingValue,
		isReplyComment,
		user: defaultUser,
	} = useCommentItemContentState()

	const { store: usePlateContextStore } = usePlateStore()
	const isResolved = usePlateContextStore((state) => state.resolved)

	const user = defaultUser as PlateUser
	const { store, addActiveCommentExampleMap } = useAIStore()
	const activeCommentExampleMap = store(
		useShallow((state) => state.activeCommentExampleMap)
	)
	const { responses, taskEnded } = useSocketStreaming()
	const { mutateAsync, data } = useCommentExampleHook()

	const readOnly = useEditorReadOnly()

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

	const userTitle = roleToData[user?.role]?.title

	const handleCopy = (data: string | null) => {
		if (!data) return
		void navigator.clipboard.writeText(data)
	}

	return (
		<div>
			<div className="relative flex items-center gap-2">
				<CommentAvatar userId={comment?.userId} />

				<h4 className="text-sm font-semibold leading-none">{user?.name}</h4>
				<If condition={!!userTitle}>
					<Badge
						variant="outline"
						className="bg-muted text-xxs leading-none text-muted-foreground"
					>
						{userTitle}
					</Badge>
				</If>

				<div className="text-xs leading-none text-muted-foreground">
					{formatDistance(comment.createdAt, Date.now())} ago
				</div>

				<If condition={!readOnly}>
					<div className="absolute -right-0.5 -top-0.5 flex items-center space-x-1">
						<If condition={!isReplyComment}>
							<CommentResolveButton />
						</If>

						<If condition={isReplyComment && user?.id === AI_USER_ID}>
							<Button asChild tooltip="Copy" size="icon" variant="ghost">
								<Copy
									className="mr-1 size-4"
									onClick={() => handleCopy(commentText)}
								/>
							</Button>
						</If>
						<If condition={!isResolved}>
							<CommentMoreDropdown onExample={() => void onExample()} />
						</If>
					</div>
				</If>
			</div>

			<div className="mb-4 pl-7 pt-0.5">
				<IfElse
					condition={!!editingValue}
					if={<CommentValue />}
					else={
						<div className="whitespace-pre-wrap text-sm">{commentText}</div>
					}
				/>
			</div>
			<If condition={!exampleData && !!key}>
				<div className="flex flex-col gap-2 p-2">
					<h2 className="font-semibold">Denke nach...</h2>
				</div>
			</If>
			<If condition={!!exampleData && !taskEnded[key]}>
				<div className="flex flex-col gap-2 p-2">
					<h2 className="text-sm font-semibold">Beispiel:</h2>
					<p className="text-xs">{exampleData}</p>
				</div>
			</If>
		</div>
	)
}

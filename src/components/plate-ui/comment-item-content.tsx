'use client'

import React, { useMemo } from 'react'
import { AI_USER_ID } from '@/constants/ai-constants'
import { roleToData } from '@/constants/global-constants'
import useCommentExampleHook from '@/hooks/mutation/use-comment-example-hook'
import useSocketStreaming from '@/hooks/use-socket-streaming'
import useAIStore from '@/store/ai-store'
import usePlateStore from '@/store/plate-store'
import {
	useCommentItemContentState,
	useCommentReplies,
} from '@udecode/plate-comments/react'
import { useEditorReadOnly } from '@udecode/plate-common/react'
import { formatDistance } from 'date-fns'
import { Copy } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useShallow } from 'zustand/react/shallow'

import IfElse, { If } from '@/components/if-else'
import { CommentAvatar } from '@/components/plate-ui/comment-avatar'
import { CommentMoreDropdown } from '@/components/plate-ui/comment-more-dropdown'
import { CommentResolveButton } from '@/components/plate-ui/comment-resolve-button'
import { CommentValue } from '@/components/plate-ui/comment-value'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import StreamedResponse from '@/components/ui/streamed-response'

import { PlateUser } from '@/types/plate-types'

export default function CommentItemContent() {
	const {
		comment,
		commentText,
		editingValue,
		isReplyComment,
		user: defaultUser,
	} = useCommentItemContentState()

	const dict = useTranslations('placeholders')

	const { store: usePlateContextStore } = usePlateStore()
	const isResolved = usePlateContextStore((state) => state.resolved)

	const user = defaultUser as PlateUser
	const { store, addActiveCommentExampleMap } = useAIStore()
	const activeCommentExampleMap = store(
		useShallow((state) => state.activeCommentExampleMap)
	)
	const { responses, taskEnded } = useSocketStreaming()
	const { mutateAsync, data } = useCommentExampleHook()

	const commentReplies = useCommentReplies(comment.id)

	const replyCount = useMemo(
		() => Object.values(commentReplies).length,
		[commentReplies]
	)

	const readOnly = useEditorReadOnly()

	const key = useMemo(
		() => data || activeCommentExampleMap[comment.id] || '',
		[data, activeCommentExampleMap, comment.id]
	)
	const exampleData = useMemo(() => {
		if (user?.id !== AI_USER_ID || !key) {
			return null
		}
		return responses[key] || []
	}, [key, user, responses])

	async function onExample() {
		const taskId = await mutateAsync()
		addActiveCommentExampleMap({ key: comment.id, value: taskId })
	}

	const userTitle = roleToData[user?.role]?.title

	const handleCopy = (data: string | null) => {
		if (!data) {
			return
		}
		void navigator.clipboard.writeText(data)
	}

	return (
		<div>
			<div className="relative flex items-center gap-2">
				<CommentAvatar userId={comment?.userId} />

				<h4 className="text-sm leading-none font-semibold">{user?.name}</h4>
				<If condition={!!userTitle}>
					<Badge
						variant="outline"
						className="bg-muted text-xxs text-muted-foreground leading-none"
					>
						{userTitle}
					</Badge>
				</If>

				<div className="text-muted-foreground text-xs leading-none">
					{formatDistance(comment.createdAt, Date.now())} ago
				</div>

				<If condition={!readOnly}>
					<div className="absolute -top-0.5 -right-0.5 flex items-center space-x-1">
						<If condition={replyCount > 0}>
							<div className="bg-muted text-muted-foreground ml-2 flex items-center rounded-full px-2 py-0.5 text-xs font-medium">
								{replyCount} {replyCount === 1 ? 'Reply' : 'Replies'}
							</div>
						</If>
						<If condition={!isReplyComment}>
							<CommentResolveButton />
						</If>

						<If condition={isReplyComment && user?.id === AI_USER_ID}>
							<Button
								asChild
								tooltip="Copy"
								size="icon"
								variant="ghost"
								className="size-4"
							>
								<Copy
									className="mr-1"
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

			<div className="mb-4 pt-0.5 pl-7">
				<IfElse
					condition={!!editingValue}
					if={<CommentValue />}
					else={
						<div className="text-sm whitespace-pre-wrap">{commentText}</div>
					}
				/>
			</div>
			<If condition={!exampleData?.length && !!key}>
				<div className="flex flex-col gap-2 p-2">
					<h2 className="font-semibold">{dict('thinking')}</h2>
				</div>
			</If>
			<If condition={!!exampleData?.length && !taskEnded[key]}>
				<div className="flex flex-col gap-2 p-2">
					<h2 className="text-sm font-semibold">{dict('example')}:</h2>
					<StreamedResponse className="tex-xs" data={exampleData || []} />
				</div>
			</If>
		</div>
	)
}

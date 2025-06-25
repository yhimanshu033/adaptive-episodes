/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import React, { useEffect, useMemo, useRef } from 'react'
import { AI_USER_ID } from '@/constants/ai-constants'
import { AI_AVATAR } from '@/constants/editor-constants'
import { roleToData } from '@/constants/global-constants'
import useCommentExampleHook from '@/hooks/mutation/use-comment-example-hook'
import useComments from '@/hooks/plate/use-comments'
import useSocketStreaming from '@/hooks/use-socket-streaming'
import { BubbleCheckIcon } from '@/icons/bubble-check-icon'
import { CopyIcon } from '@/icons/copy-icon'
import { StopIcon } from '@/icons/stop-icon'
import useAIStore from '@/store/ai-store'
import useShowExampleVisibility from '@/store/comment-store'
import usePlateStore from '@/store/plate-store'
import {
	useCommentItemContentState,
	useCommentReplies,
} from '@udecode/plate-comments/react'
import { useEditorReadOnly } from '@udecode/plate-common/react'
import { formatDistance } from 'date-fns'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'
import { useShallow } from 'zustand/react/shallow'

import { Avatar, AvatarImage } from '@/components/aural-ui/avatar'
import Badge from '@/components/aural-ui/badge'
import { Button } from '@/components/aural-ui/button'
import { Divider } from '@/components/aural-ui/divider'
import { IconButton } from '@/components/aural-ui/icon-button'
import { Else, If, IfElse } from '@/components/aural-ui/if-else'
import Label from '@/components/aural-ui/label'
import { Typography } from '@/components/aural-ui/typography'
import { CommentAvatar } from '@/components/plate-ui/comment-avatar'
import { CommentMoreDropdown } from '@/components/plate-ui/comment-more-dropdown'
import { CommentResolveButton } from '@/components/plate-ui/comment-resolve-button'
import { CommentValue } from '@/components/plate-ui/comment-value'
import StreamedResponse from '@/components/ui/streamed-response'

import { PlateUser } from '@/types/plate-types'

export default function CommentItemContent() {
	const scrollRef = useRef<HTMLDivElement>(null)

	const {
		comment,
		commentText,
		editingValue,
		isReplyComment,
		user: defaultUser,
	} = useCommentItemContentState()
	const { setShowExample } = useShowExampleVisibility()

	const dict = useTranslations('placeholders')

	const { store: usePlateContextStore } = usePlateStore()
	const isResolved = usePlateContextStore((state) => state.resolved)

	const user = defaultUser as PlateUser
	const { store, addActiveCommentExampleMap } = useAIStore()
	const activeCommentExampleMap = store(
		useShallow((state) => state.activeCommentExampleMap)
	)
	const { responses, taskEnded, stopTask } = useSocketStreaming()
	const { mutateAsync, data } = useCommentExampleHook()

	const commentReplies = useCommentReplies(comment.id)

	const replyCount = useMemo(
		() => Object.values(commentReplies).length,
		[commentReplies]
	)

	const { activeCommentId } = useComments()

	const readOnly = useEditorReadOnly()

	const key = useMemo(
		() => data || activeCommentExampleMap[comment.id] || '',
		[data, activeCommentExampleMap, comment.id]
	)
	const taskEndStatus = taskEnded[key]

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
		toast.success('Comment copied successfully.', {
			icon: <BubbleCheckIcon />,
		})
		void navigator.clipboard.writeText(data)
	}
	const handelStopTask = () => {
		stopTask(key)
	}

	useEffect(() => {
		const block = document.getElementById(`example-data-${comment.id}`)
		const placeholder = document.getElementById(
			`example-placeholder-${comment.id}`
		)

		if (block && placeholder) {
			placeholder.appendChild(block)
		}
	}, [comment.id])

	useEffect(() => {
		const isVisible = taskEnded[key]
			? false
			: (!!exampleData?.length && !taskEnded[key]) ||
				(!exampleData?.length && !!key)

		setShowExample(comment.id, isVisible)

		return () => {
			setShowExample(comment.id, false)
		}
	}, [comment.id, exampleData?.length, key, taskEndStatus])

	useEffect(() => {
		if (scrollRef.current) {
			scrollRef.current.scrollTop = scrollRef.current.scrollHeight
		}
	}, [exampleData])

	return (
		<div className="space-y-3">
			<div className="group flex items-center justify-between gap-2">
				<div className="flex items-center gap-2">
					<CommentAvatar userId={comment?.userId} />
					<div className="flex flex-col">
						<div className="flex gap-2">
							<Typography color="primary" variant="body-small">
								{user?.name}
							</Typography>
							<If condition={!!userTitle}>
								<Badge size="xs">{userTitle}</Badge>
							</If>
						</div>
						<Typography variant="caption-medium" color="tertiary">
							{formatDistance(comment.createdAt, Date.now())} ago
						</Typography>
					</div>
				</div>

				<If condition={!readOnly}>
					<div className="flex items-center">
						<If condition={isReplyComment && user?.id === AI_USER_ID}>
							<IconButton
								label="copy button"
								variant="ghost"
								size="small"
								onClick={() => handleCopy(commentText)}
								className="hover:!text-fm-primary text-fm-icon-inactive opacity-0 transition-opacity group-hover:opacity-100"
								icon={<CopyIcon className="size-4 text-inherit" />}
								shape="square"
							/>
						</If>
						<If condition={!isResolved}>
							<CommentMoreDropdown
								onExample={() => void onExample()}
								showIconOnSelect={activeCommentId === comment.id}
							/>
						</If>

						<If condition={!isReplyComment}>
							<CommentResolveButton />
						</If>
					</div>
				</If>
			</div>

			<div className="mb-4 pt-0.5">
				<IfElse condition={!!editingValue}>
					<If>
						<CommentValue />
					</If>
					<Else>
						<Typography
							className="break-words whitespace-pre-wrap"
							color="tertiary"
							variant="body-small"
						>
							{commentText}
						</Typography>
					</Else>
				</IfElse>
			</div>
			<div id={`example-data-${comment.id}`}>
				<If condition={taskEndStatus ? false : !exampleData?.length && !!key}>
					<div className="mt-4 flex items-center gap-2">
						<Avatar className="size-8">
							<AvatarImage alt="AI avatar" src={AI_AVATAR} />
						</Avatar>
						<div className="bg-fm-surface-frosted/20 border-fm-divider-secondary flex h-10 w-full items-center justify-between rounded-[0.5px] border p-3 pl-4">
							<div className="leading-fm-md [background-image:linear-gradient(270deg,var(--color-fm-placeholder)_12.22%,var(--color-fm-primary)_31.77%,var(--color-fm-primary)_67.87%,var(--color-fm-placeholder)_96.75%)] bg-clip-text [font-size:var(--text-fm-md)] font-medium text-transparent">
								{dict('thinking')}
							</div>
							<IconButton
								label="Stop example generation"
								variant="ghost"
								size="small"
								onClick={handelStopTask}
								className="hover:!text-fm-primary text-fm-icon-inactive"
								icon={<StopIcon className="size-4 text-inherit" />}
							/>
						</div>
					</div>
				</If>
				<If condition={!!exampleData?.length && !taskEnded[key]}>
					<div className="mt-4 flex gap-2">
						<Avatar className="mt-2 size-8">
							<AvatarImage alt="AI avatar" src={AI_AVATAR} />
						</Avatar>

						<div className="bg-fm-surface-frosted/20 border-fm-divider-secondary flex w-full flex-col gap-2 rounded-xs border p-2">
							<div
								ref={scrollRef}
								className="flex max-h-20 flex-col gap-2 overflow-y-auto"
							>
								<Typography variant="body-small">{dict('example')}:</Typography>
								<StreamedResponse
									className="text-fm-md"
									data={exampleData || []}
								/>
							</div>

							<Divider />
							<div className="flex justify-end">
								<Button
									variant="text"
									className="!w-fit"
									size="sm"
									innerClassName="!w-fit !pb-0"
									onClick={handelStopTask}
								>
									Stop
								</Button>
							</div>
						</div>
					</div>
				</If>
			</div>
			<If condition={replyCount > 0 && activeCommentId !== comment.id}>
				<Label className="text-fm-secondary-800">
					{replyCount} {replyCount === 1 ? 'Reply' : 'Replies'}
				</Label>
			</If>
		</div>
	)
}

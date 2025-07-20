import React, { useEffect, useMemo, useRef } from 'react'
import { AI_USER_ID } from '@/constants/ai-constants'
import { AI_AVATAR } from '@/constants/editor-constants'
import useCommentExampleHook from '@/hooks/mutation/use-comment-example-hook'
import useSocketStreaming from '@/hooks/use-socket-streaming'
import { StopIcon } from '@/icons/stop-icon'
import useAIStore from '@/store/ai-store'
import useShowExampleVisibility from '@/store/comment-store'
import { useTranslations } from 'next-intl'
import { useShallow } from 'zustand/react/shallow'

import { Avatar, AvatarImage } from '../aural-ui/avatar'
import { Button } from '../aural-ui/button'
import { Divider } from '../aural-ui/divider'
import { IconButton } from '../aural-ui/icon-button'
import { If } from '../aural-ui/if-else'
import { Typography } from '../aural-ui/typography'
import { TComment } from '../plate-ui-v2/comment'
import StreamedResponse from '../ui/streamed-response'

const CommentExampleContent = ({
	comment,
	data,
}: {
	comment: TComment
	data?: string
}) => {
	const { store } = useAIStore()
	const activeCommentExampleMap = store(
		useShallow((state) => state.activeCommentExampleMap)
	)
	const { responses, taskEnded, stopTask } = useSocketStreaming()

	const setShowExample = useShowExampleVisibility(
		(state) => state.setShowExample
	)

	const dict = useTranslations('placeholders')

	const scrollRef = useRef<HTMLDivElement>(null)

	const key = useMemo(
		() => data || activeCommentExampleMap[comment.id] || '',
		[data, activeCommentExampleMap, comment.id]
	)
	const taskEndStatus = taskEnded[key]

	const exampleData = useMemo(() => {
		if (comment.userId !== AI_USER_ID || !key) {
			return null
		}
		return responses[key] || []
	}, [comment.userId, key, responses])

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
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [comment.id, exampleData?.length, key, taskEndStatus])

	useEffect(() => {
		if (scrollRef.current) {
			scrollRef.current.scrollTop = scrollRef.current.scrollHeight
		}
	}, [exampleData])

	return (
		<div id={`example-data-${comment.id}`}>
			<If condition={taskEndStatus ? false : !exampleData?.length && !!key}>
				<div className="mt-4 flex items-center gap-2">
					<Avatar className="size-8">
						<AvatarImage alt="AI avatar" src={AI_AVATAR} />
					</Avatar>
					<div className="bg-fm-surface-frosted/20 border-fm-divider-secondary flex h-10 w-full items-center justify-between rounded-[0.5px] border p-3 pl-4">
						<div className="animate-gradient-slide bg-clip-text text-transparent">
							{dict('thinking')}
						</div>
						<IconButton
							label="Stop example generation"
							variant="ghost"
							size="small"
							onClick={() => stopTask(key)}
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
								onClick={() => stopTask(key)}
							>
								Stop
							</Button>
						</div>
					</div>
				</div>
			</If>
		</div>
	)
}

export default CommentExampleContent

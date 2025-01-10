/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect, useRef } from 'react'
import { DiffStatus } from '@/constants/ai-constants'
import {
	COPILOT_LOGO_URL,
	FALLBACK_USER_URL,
} from '@/constants/global-constants'
import useSocketStreaming from '@/hooks/use-socket-streaming'
import useAIStore from '@/store/ai-store'
import { useGlobalStore } from '@/store/global-store'
import { useEditorRef } from '@udecode/plate-common/react'
import { DiffOperation, DiffUpdate } from '@udecode/plate-diff'
import { Check, CheckCheck, Copy, X } from 'lucide-react'
import { nanoid } from 'nanoid'
import { useShallow } from 'zustand/react/shallow'

import { Loader } from '@/components/loader'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { TooltipComponent } from '@/components/ui/tooltip-component'
import { cn, extractBetweenTags } from '@/lib/utils'

import { EAction, EMessenger, TMessage } from '@/types/ai-types'

function extract(str: string) {
	return extractBetweenTags(extractBetweenTags(str, 'answer'), 'text')
}

function AILogo({ message }: { message: TMessage }) {
	return (
		message.role === EMessenger.ASSISTANT && (
			<Avatar className="mr-2">
				<AvatarImage src={COPILOT_LOGO_URL} alt="AI" />
				<AvatarFallback>AI</AvatarFallback>
			</Avatar>
		)
	)
}

function UserLogo({ message }: { message: TMessage }) {
	const userData = useGlobalStore(useShallow((state) => state.userData))
	return (
		message.role === EMessenger.USER && (
			<Avatar className="ml-2">
				<AvatarImage
					src={userData?.user?.image || FALLBACK_USER_URL}
					alt="User"
				/>
				<AvatarFallback>U</AvatarFallback>
			</Avatar>
		)
	)
}

function AILoader({ isPending }: { isPending: boolean }) {
	return (
		isPending && (
			<div className="mb-4 flex items-center justify-start">
				<Avatar className="mr-2">
					<AvatarImage src={COPILOT_LOGO_URL} alt="AI" />
					<AvatarFallback>AI</AvatarFallback>
				</Avatar>
				<Loader />
			</div>
		)
	)
}

const MessagesList = ({ isPending }: { isPending: boolean }) => {
	const {
		store,
		updateMessages,
		setPrevValue,
		setResponseValue,
		setAcceptedValue,
	} = useAIStore()
	const { messages } = store()
	const { responses, taskEnded } = useSocketStreaming()
	const value = store(useShallow((state) => state.acceptedValue))
	const editor = useEditorRef()
	const messageEndRef = useRef<HTMLDivElement>(null)

	function handleAccept(i: number, all: boolean = true) {
		handleAcceptResponse(all)
		updateMessages(
			{
				taskId: nanoid(),
				role: EMessenger.ASSISTANT,
				action: EAction.ACCEPT,
				content: 'Accepted changes from StoryChat',
			},
			i
		)
	}

	const handleReject = useCallback((i: number) => {
		updateMessages(
			{
				taskId: nanoid(),
				role: EMessenger.ASSISTANT,
				action: EAction.REJECT,
				content: 'Rejected changes from StoryChat',
			},
			i
		)
		setResponseValue(null)
		setPrevValue(null)
	}, [])

	const handleAcceptResponse = useCallback(
		(all: boolean = true) => {
			if (!value) return
			const newValue = structuredClone(value)
			const currVal = newValue.map((node) => ({
				...node,
				children: node.children
					.map((child) => {
						let add = true
						if ('diff' in child && child.diff_id) {
							const accepted = all
								? child.status === DiffStatus.ACCEPTED ||
									child.status === DiffStatus.PENDING
								: child.status === DiffStatus.ACCEPTED
							const type = (child.diffOperation as DiffOperation).type
							if (type === 'update') {
								Object.keys(
									(child.diffOperation as DiffUpdate)?.newProperties
								).forEach((key) => {
									delete child[key]
								})
							}
							delete child.diff
							delete child.diff_id
							delete child.status
							delete child.diffOperation
							if (
								(accepted && type !== 'delete') ||
								(!accepted && type === 'delete') ||
								(child.text && (child.text as string).match(/^\n+$/))
							) {
								add = true
							} else {
								add = false
							}
						}
						if (add) {
							return child
						}
					})
					.filter((child) => !!child),
			}))
			editor.tf.setValue(currVal)
			setResponseValue(null)
			setPrevValue(null)
			setAcceptedValue(null)
		},
		[value, editor.tf]
	)
	useEffect(() => {
		if (messageEndRef.current) {
			messageEndRef.current.scrollIntoView({
				behavior: 'smooth',
			})
		}
	}, [messages])

	const lastMessageId =
		messages.findLast((m) => m.role === EMessenger.ASSISTANT)?.taskId || ''

	const RenderMessage = useCallback(
		({ message, index }: { index: number; message: TMessage }) => {
			if (
				message.role === EMessenger.ASSISTANT &&
				message.action === EAction.CHANGES
			) {
				if (taskEnded[message.taskId]) {
					return (
						<div className="flex max-w-[70%] gap-2 rounded-lg p-3">
							<TooltipComponent tooltip={'Done'}>
								<Button onClick={() => handleAccept(index, false)}>
									<Check />
								</Button>
							</TooltipComponent>
							<TooltipComponent tooltip={'Accept All'}>
								<Button
									variant="outline"
									onClick={() => handleAccept(index, true)}
								>
									<CheckCheck />
								</Button>
							</TooltipComponent>
							<TooltipComponent tooltip={'Reject All'}>
								<Button variant="outline" onClick={() => handleReject(index)}>
									<X />
								</Button>
							</TooltipComponent>
						</div>
					)
				}
				return (
					<div
						dangerouslySetInnerHTML={{
							__html: message.content,
						}}
						className={cn(
							'max-w-[70%] rounded-lg p-3',
							message.role === EMessenger.ASSISTANT
								? 'bg-background'
								: 'bg-primary'
						)}
					/>
				)
			}
			if (
				message.role === EMessenger.ASSISTANT &&
				message.action === EAction.BLOCK
			) {
				if ((responses[message.taskId] || []).length) {
					return (
						<div className="relative max-w-[70%]">
							{taskEnded[message.taskId] &&
								!!extract((responses[message.taskId] || []).join('')).trim()
									.length && (
									<TooltipComponent tooltip={'Copy'}>
										<Button
											onClick={() => {
												void navigator.clipboard.writeText(
													extract((responses[message.taskId] || []).join(''))
												)
											}}
											variant="ghost"
											className="absolute -right-1 top-1 size-6 translate-x-full !p-1 transition-all hover:scale-105 active:scale-75"
										>
											<Copy size={12} />
										</Button>
									</TooltipComponent>
								)}
							<div
								onClick={() => {
									void navigator.clipboard.writeText(
										extract((responses[message.taskId] || []).join(''))
									)
								}}
								dangerouslySetInnerHTML={{
									__html: (responses[message.taskId] || [])
										.join('')
										.replaceAll('\n', '<br/>')
										.replace(
											/<text>/g,
											"<span class='bg-background-editor rounded-md'>"
										)
										.replace(/<\/text>/g, '</span>'),
								}}
								className={cn(
									'rounded-lg p-3 transition-transform *:animate-in active:scale-[0.995]',
									message.role === EMessenger.ASSISTANT
										? 'bg-background'
										: 'bg-primary'
								)}
							/>
						</div>
					)
				}
				return (
					<div
						dangerouslySetInnerHTML={{
							__html: 'Denke nach...',
						}}
						className={cn(
							'max-w-[70%] rounded-lg p-3',
							message.role === EMessenger.ASSISTANT
								? 'bg-background'
								: 'bg-primary'
						)}
					/>
				)
			}
			return (
				<div
					dangerouslySetInnerHTML={{
						__html: message.content.replaceAll('\n', '<br/>'),
					}}
					className={cn(
						'max-w-[70%] rounded-lg p-3',
						message.role === EMessenger.ASSISTANT
							? 'bg-background'
							: 'bg-primary'
					)}
				/>
			)
		},
		[responses[lastMessageId], taskEnded[lastMessageId]]
	)

	return (
		<ScrollArea className="mb-4 flex-[1_1_auto] rounded-md border px-4 *:py-4">
			{messages.map((message, index) => (
				<div
					key={index}
					className={`mb-4 flex items-start ${message.role === EMessenger.ASSISTANT ? 'justify-start' : 'justify-end'}`}
				>
					<AILogo message={message} />
					<RenderMessage message={message} index={index} />
					<UserLogo message={message} />
				</div>
			))}
			<AILoader isPending={isPending} />
			<div ref={messageEndRef} />
		</ScrollArea>
	)
}

export default MessagesList

/* eslint-disable @typescript-eslint/no-misused-promises */
'use client'

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useParams } from 'next/navigation'
import { DiffStatus, quickPrompts } from '@/constants/ai-constants'
import { storyChatSuggestions } from '@/constants/editor-constants'
import {
	COPILOT_LOGO_URL,
	FALLBACK_USER_URL,
} from '@/constants/global-constants'
import useAIChatbotHook from '@/hooks/mutation/use-aichatbot-hook'
import useEpisodeContent from '@/hooks/query/use-episode-content'
import { useStoriesData } from '@/hooks/query/use-story-data'
import useAIStore from '@/store/ai-store'
import { useGlobalStore } from '@/store/global-store'
import usePlateStore from '@/store/plate-store'
import { CommentsPlugin } from '@udecode/plate-comments/react'
import {
	ParagraphPlugin,
	useEditorPlugin,
	useEditorRef,
	useEditorState,
} from '@udecode/plate-common/react'
import { DiffOperation, DiffUpdate } from '@udecode/plate-diff'
import { Value } from '@udecode/slate'
import {
	Check,
	CheckCheck,
	Copy,
	Send,
	StopCircle,
	Trash2,
	X,
} from 'lucide-react'
import { useShallow } from 'zustand/react/shallow'

import { Loader } from '@/components/loader'
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Textarea } from '@/components/ui/textarea'
import { TooltipComponent } from '@/components/ui/tooltip-component'
import {
	cn,
	convertReviewResponse,
	getRandomElement,
	getText,
	minify,
	replaceMatches,
} from '@/lib/utils'

import {
	EAction,
	EChatMode,
	EMessenger,
	TStoryChatSuggestion,
} from '@/types/ai-types'
import { IndexedCommentsResponse } from '@/types/editor-types'

const AIChatbot = () => {
	const [input, setInput] = useState('')
	const { id } = useParams()
	const messageEndRef = useRef<HTMLDivElement>(null)
	const textareaRef = useRef<HTMLTextAreaElement>(null)
	const {
		store,
		addMessages,
		clearMessages,
		popMessage,
		setAcceptedValue,
		setPrevValue,
		setResponseValue,
		updateMessages,
		setRequestedAction,
	} = useAIStore()
	const { setSidebar } = usePlateStore()
	const { messages } = store()
	const { aiChatbotMutation } = useAIChatbotHook()
	const { data: aiResponse, isPending, reset } = aiChatbotMutation
	const userData = useGlobalStore(useShallow((state) => state.userData))
	const { data: episodeContent } = useEpisodeContent()
	const { data: stories } = useStoriesData()
	const editor = useEditorRef()
	const { children } = useEditorState()
	const requestedAction = store((state) => state.requestedAction)
	const value = store((state) => state.acceptedValue)
	const prevValue = store((state) => state.prevValue)
	const { api } = useEditorPlugin(CommentsPlugin)

	const episodesCount = useMemo(() => {
		return stories?.find((data) => data?.id === Number(id))?.episode_count || 0
	}, [stories, id])

	const handleSendMessage = (e: React.FormEvent) => {
		e.preventDefault()
		if (!input.trim()) return
		aiChatbotMutation.mutate({
			episodeNumber: episodeContent?.chapter.seq_number || 0,
			episodesCount,
			aiChatbotData: {
				messages: messages.map((message) => ({
					content: message.content || '',
					role: message.role,
				})),
				user_message: input,
				ep_number: episodeContent?.chapter.seq_number?.toString(),
				ep_text: getText(children),
			},
		})
		addMessages({ role: EMessenger.USER, content: input })
		setInput('')
		setRequestedAction(EChatMode.BLOCK)
	}

	const handleSuggestion = (suggestion: TStoryChatSuggestion) => {
		if (suggestion.action === EChatMode.LOCALIZE) {
			setSidebar('far')
			return
		}
		if (suggestion.action === EChatMode.PROMPTS) {
			setInput(getRandomElement(quickPrompts))
			return
		}
		addMessages({ role: EMessenger.USER, content: suggestion.value })
		aiChatbotMutation.mutate({
			episodeNumber: episodeContent?.chapter.seq_number || 0,
			episodesCount,
			aiChatbotData: {
				messages,
				user_message: suggestion.value,
				ep_number: episodeContent?.chapter.seq_number?.toString(),
				ep_text: episodeContent?.text as string,
				ep_text_json: minify(children),
				chat_mode: suggestion.action,
			},
		})
		setRequestedAction(suggestion.action)
	}

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault()
			handleSendMessage(e)
		}
	}

	const handleBlock = ({ text }: { text: string }) => {
		addMessages({
			role: EMessenger.ASSISTANT,
			content: text,
			action: EAction.BLOCK,
		})
	}

	const handleSFX = (resp: string) => {
		const matches = resp.match(/((\[!.*\])*\n+)+/g)
		const hasSFX = matches?.some((match) => /\[.*\]/.test(match)) || false
		if (!matches || !hasSFX) {
			addMessages({
				role: EMessenger.ASSISTANT,
				action: EAction.BLOCK,
				content: JSON.stringify([
					{
						id: `0`,
						type: ParagraphPlugin.key,
						children: [{ text: 'Oops! no SFX generated' }],
					},
				]),
			})
			return
		}
		const responseValue = structuredClone(children)
		handleChanges(replaceMatches(/(\n{2,})/g, matches, responseValue))
	}

	const handleChanges = (aiResponse: Value) => {
		setResponseValue(structuredClone(aiResponse))
		setPrevValue(structuredClone(children))
		addMessages({
			role: EMessenger.ASSISTANT,
			action: EAction.CHANGES,
			content: 'Added changes from StoryChat',
		})
	}

	function handleAccept(i: number, all: boolean = true) {
		handleAcceptResponse(all)
		updateMessages(
			{
				role: EMessenger.ASSISTANT,
				action: EAction.ACCEPT,
				content: 'Accepted changes from StoryChat',
			},
			i
		)
	}

	function handleReject(i: number) {
		updateMessages(
			{
				role: EMessenger.ASSISTANT,
				action: EAction.REJECT,
				content: 'Rejected changes from StoryChat',
			},
			i
		)
		setResponseValue(null)
		setPrevValue(null)
	}

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
								(!accepted && type === 'delete')
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
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[value, editor.tf]
	)

	function addReview(reviewResponse: IndexedCommentsResponse[]) {
		const resp = convertReviewResponse(reviewResponse, children)
		resp.comments.forEach((comment) => {
			api.comment.addComment({
				value: [{ type: 'p', children: [{ text: comment.text }] }],
				id: comment.id,
				userId: 'COPILOT-AI',
				createdAt: Date.now(),
			})
		})
		editor.tf.setValue(resp.value)
		addMessages({
			role: EMessenger.ASSISTANT,
			action: EAction.REVIEW,
			content: reviewResponse.length
				? 'StoryChat added review in comments'
				: 'No reviews from StoryChat',
		})
	}

	const changesPending = prevValue && value

	useEffect(() => {
		if (!isPending && aiResponse) {
			if (requestedAction === EChatMode.REVIEW) {
				addReview(JSON.parse(aiResponse as string) as IndexedCommentsResponse[])
			} else if (requestedAction === EChatMode.SFX) {
				handleSFX(aiResponse as string)
			} else {
				handleBlock({ text: aiResponse as string })
			}
			setRequestedAction(null)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [aiResponse, isPending])

	useEffect(() => {
		if (messageEndRef.current) {
			messageEndRef.current.scrollIntoView({
				behavior: 'smooth',
			})
		}
	}, [messages])

	useEffect(() => {
		if (textareaRef.current) {
			textareaRef.current.style.height = '40px'
			const scrollHeight = textareaRef.current.scrollHeight
			textareaRef.current.style.height = `${Math.min(scrollHeight, 150)}px`
		}
	}, [input])

	return (
		<div className="mx-auto max-w-2xl flex-1 flex-col p-4">
			<h1 className="mb-4 text-2xl font-bold">StoryChat</h1>
			<ScrollArea className="mb-4 h-[70vh] flex-1 rounded-md border px-4 *:py-4">
				{messages.map((message, index) => (
					<div
						key={index}
						className={`mb-4 flex items-start ${message.role === EMessenger.ASSISTANT ? 'justify-start' : 'justify-end'}`}
					>
						{message.role === EMessenger.ASSISTANT && (
							<Avatar className="mr-2">
								<AvatarImage src={COPILOT_LOGO_URL} alt="AI" />
								<AvatarFallback>AI</AvatarFallback>
							</Avatar>
						)}
						{message.role === EMessenger.ASSISTANT &&
						message.action === EAction.CHANGES ? (
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
						) : message.role === EMessenger.ASSISTANT &&
						  message.action === EAction.BLOCK ? (
							<div className="relative max-w-[70%]">
								<TooltipComponent tooltip={'Copy'}>
									<Button
										onClick={() => {
											void navigator.clipboard.writeText(message.content)
										}}
										variant="ghost"
										className="absolute -right-1 top-1 size-6 translate-x-full !p-1 transition-all hover:scale-105 active:scale-75"
									>
										<Copy size={12} />
									</Button>
								</TooltipComponent>
								<div
									dangerouslySetInnerHTML={{
										__html: message.content.replaceAll('\n', '<br/>'),
									}}
									className={cn(
										'rounded-lg p-3',
										message.role === EMessenger.ASSISTANT
											? 'bg-background'
											: 'bg-primary'
									)}
								/>
							</div>
						) : (
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
						)}
						{message.role === EMessenger.USER && (
							<Avatar className="ml-2">
								<AvatarImage
									src={userData?.user?.image || FALLBACK_USER_URL}
									alt="User"
								/>
								<AvatarFallback>U</AvatarFallback>
							</Avatar>
						)}
					</div>
				))}

				{isPending && (
					<div className="mb-4 flex items-center justify-start">
						<Avatar className="mr-2">
							<AvatarImage src={COPILOT_LOGO_URL} alt="AI" />
							<AvatarFallback>AI</AvatarFallback>
						</Avatar>
						<Loader />
					</div>
				)}

				<div ref={messageEndRef} />
			</ScrollArea>
			<ScrollArea className="overflow-x-auto pb-2 *:*:flex">
				<ScrollBar orientation="horizontal" />
				{storyChatSuggestions.map((suggestion, index) => (
					<Button
						key={index}
						variant="outline"
						size="sm"
						onClick={() => {
							handleSuggestion(suggestion)
						}}
						className="mb-1 mr-2"
						disabled={!!changesPending || isPending}
					>
						{suggestion.value}
					</Button>
				))}
			</ScrollArea>
			<div className="flex items-end gap-1">
				<form
					onSubmit={handleSendMessage}
					className="flex flex-1 items-end space-x-2 rounded-md border bg-background"
				>
					<Textarea
						ref={textareaRef}
						placeholder="Type your message..."
						disabled={isPending}
						value={input}
						onChange={(e) => setInput(e.target.value)}
						onKeyDown={handleKeyDown}
						className="min-h-[40px] grow resize-none overflow-y-auto border-none bg-transparent px-3 py-2 leading-relaxed outline-none focus-visible:border-none focus-visible:ring-0 focus-visible:ring-offset-0"
						style={{ height: '40px' }}
					/>
					{isPending ? (
						<Button
							variant="ghost"
							size="icon"
							type="button"
							onClick={() => {
								popMessage()
								reset()
							}}
						>
							<StopCircle size={16} />
						</Button>
					) : (
						<Button variant="ghost" size="icon" type="submit">
							<Send size={16} />
						</Button>
					)}
				</form>
				<AlertDialog>
					<AlertDialogTrigger asChild>
						<Button variant="ghost" size="icon">
							<Trash2 size={16} />
						</Button>
					</AlertDialogTrigger>
					<AlertDialogContent>
						<AlertDialogHeader>
							<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
							<AlertDialogDescription>
								This action cannot be undone. This will permanently delete your
								chat history from our records.
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogCancel>Cancel</AlertDialogCancel>
							<AlertDialogAction onClick={clearMessages}>
								Continue
							</AlertDialogAction>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>
			</div>
		</div>
	)
}

export default AIChatbot

/* eslint-disable @typescript-eslint/no-misused-promises */
'use client'

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useParams } from 'next/navigation'
import { DiffStatus } from '@/constants/ai-constants'
import useAIChatbotHook from '@/hooks/mutation/use-aichatbot-hook'
import useAIChatbotHookTest from '@/hooks/mutation/use-aichatbot-repl-hook'
import useEpisodeContent from '@/hooks/query/use-episode-content'
import { useStoriesData } from '@/hooks/query/use-story-data'
import { ex } from '@/mock-data/aichatbot'
import useAIStore, {
	addMessages,
	clearMessages,
	setAcceptedValue,
	setPrevValue,
	setResponseValue,
	updateMessages,
} from '@/store/ai-store'
import { useGlobalStore } from '@/store/global-store'
import { useEditorRef, useEditorState } from '@udecode/plate-common/react'
import { DiffOperation, DiffUpdate } from '@udecode/plate-diff'
import { Check, CheckCheck, LoaderCircle, Send, Trash2, X } from 'lucide-react'
import { useShallow } from 'zustand/react/shallow'

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
import { cn, getText } from '@/lib/utils'

const AIChatbot = () => {
	const [input, setInput] = useState('')
	const { id } = useParams()
	const messageEndRef = useRef<HTMLDivElement>(null)
	const textareaRef = useRef<HTMLTextAreaElement>(null)
	const { messages } = useAIStore()
	const { aiChatbotMutation } = useAIChatbotHook()
	const { aiChatbotMutationTest } = useAIChatbotHookTest()
	const { data: aiResponse, isPending } = aiChatbotMutation
	const { data: aiResponseTest } = aiChatbotMutationTest
	const userData = useGlobalStore(useShallow((state) => state.userData))
	const { data: episodeContent } = useEpisodeContent()
	const { data: stories } = useStoriesData()
	const editor = useEditorRef()
	const { children } = useEditorState()
	const value = useAIStore((state) => state.acceptedValue)
	const prevValue = useAIStore((state) => state.prevValue)

	const episodesCount = useMemo(() => {
		return stories?.find((data) => data?.id === Number(id))?.episode_count || 0
	}, [stories, id])

	const handleSendMessage = (e: React.FormEvent) => {
		e.preventDefault()
		if (!input.trim()) return
		addMessages({ role: 'user', content: input })
		setInput('')
		aiChatbotMutation.mutate({
			episodeNumber: episodeContent?.chapter.seq_number || 0,
			episodesCount,
			aiChatbotData: {
				messages,
				user_message: input,
				ep_number: episodeContent?.chapter.seq_number?.toString(),
				ep_text: getText(children),
			},
		})
	}

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault()
			handleSendMessage(e)
		}
	}
	useEffect(() => {
		if (!isPending && aiResponse) {
			addMessages({ role: 'assistant', content: aiResponse as string })
		}
	}, [aiResponse, isPending])

	useEffect(() => {
		if (messageEndRef.current) {
			messageEndRef.current.scrollIntoView({ behavior: 'smooth' })
		}
	}, [messages])

	useEffect(() => {
		if (textareaRef.current) {
			textareaRef.current.style.height = '40px'
			const scrollHeight = textareaRef.current.scrollHeight
			textareaRef.current.style.height = `${Math.min(scrollHeight, 150)}px`
		}
	}, [input])

	useEffect(() => {
		if (!aiResponseTest) return
		setResponseValue(structuredClone(ex.current))
		setPrevValue(structuredClone(ex.previous))
		addMessages({ role: 'assistant', content: 'accept-reject' })
	}, [aiResponseTest])

	function handleAccept(i: number, all: boolean = true) {
		handleAcceptResponse(all)
		updateMessages({ role: 'assistant', content: 'accepted' }, i)
	}

	function handleReject(i: number) {
		updateMessages({ role: 'assistant', content: 'rejected' }, i)
		setResponseValue(null)
		setPrevValue(null)
		if (prevValue) editor.tf.setValue(structuredClone(prevValue))
	}

	const suggestions = ['Add Music / Sound FX 🎶', 'Voice Pass 🎙️', 'Review ✅']

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
		[value, editor.tf]
	)

	const changesPending = prevValue && value

	return (
		<div className="mx-auto flex h-full max-w-2xl flex-col p-4">
			<h1 className="mb-4 text-2xl font-bold">StoryChat</h1>
			<ScrollArea className="mb-4 flex-1 rounded-md border p-4">
				{messages.map((message, index) => (
					<div
						key={index}
						className={`mb-4 flex items-start ${message.role === 'assistant' ? 'justify-start' : 'justify-end'}`}
					>
						{message.role === 'assistant' && (
							<Avatar className="mr-2">
								<AvatarImage src="/pocket-copilot-logo.webp" alt="AI" />
								<AvatarFallback>AI</AvatarFallback>
							</Avatar>
						)}
						{message.role === 'assistant' &&
						message.content === 'accept-reject' ? (
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
						) : message.role === 'assistant' &&
						  (message.content === 'accepted' ||
								message.content === 'rejected') ? (
							<div className="flex max-w-[70%] gap-2 rounded-lg p-3">
								<p className="italic">{message.content} changes from chatbot</p>
							</div>
						) : (
							<div
								dangerouslySetInnerHTML={{
									__html: message.content.replaceAll('\n', '<br/>'),
								}}
								className={cn(
									'max-w-[70%] rounded-lg p-3',
									message.role === 'assistant' ? 'bg-background' : 'bg-primary'
								)}
							/>
						)}
						{message.role === 'user' && (
							<Avatar className="ml-2">
								<AvatarImage
									src={userData?.user?.image || '/placeholder-user.webp'}
									alt="User"
								/>
								<AvatarFallback>U</AvatarFallback>
							</Avatar>
						)}
					</div>
				))}
				<div ref={messageEndRef} />
			</ScrollArea>
			<ScrollArea className="overflow-x-auto pb-2 *:*:flex">
				<ScrollBar orientation="horizontal" />
				{suggestions.map((suggestion, index) => (
					<Button
						key={index}
						variant="outline"
						size="sm"
						onClick={() => {
							addMessages({ role: 'user', content: suggestion })
							aiChatbotMutationTest.mutate({
								episodeNumber: episodeContent?.chapter.seq_number || 0,
								episodesCount,
								aiChatbotData: {
									messages,
									user_message: suggestion,
									ep_number: episodeContent?.chapter.seq_number?.toString(),
									ep_text: episodeContent?.text as string,
								},
							})
						}}
						className="mr-2"
						disabled={!!changesPending}
					>
						{suggestion}
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
					<Button
						variant="ghost"
						size="icon"
						type="submit"
						disabled={isPending}
					>
						{isPending ? (
							<LoaderCircle className="animate-spin" size={16} />
						) : (
							<Send size={16} />
						)}
					</Button>
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

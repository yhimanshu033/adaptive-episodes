/* eslint-disable @typescript-eslint/no-misused-promises */
'use client'

import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'next/navigation'
import useAIChatbotHook from '@/hooks/mutation/use-aichatbot-hook'
import useEpisodeContent from '@/hooks/query/use-episode-content'
import useAIStore, { addMessages, clearMessages } from '@/store/ai-store'
import { useGlobalStore } from '@/store/global-store'
import { LoaderCircle, Send, Trash2 } from 'lucide-react'
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
import { ScrollArea } from '@/components/ui/scroll-area'
import { Textarea } from '@/components/ui/textarea'

const AIChatbot = () => {
	const [input, setInput] = useState('')
	const messageEndRef = useRef<HTMLDivElement>(null)
	const textareaRef = useRef<HTMLTextAreaElement>(null)
	const { messages } = useAIStore()
	const { aiChatbotMutation } = useAIChatbotHook()
	const { data: aiResponse, isPending } = aiChatbotMutation
	const userData = useGlobalStore(useShallow((state) => state.userData))
	const { episodeId } = useParams()
	const { data: episodeContent } = useEpisodeContent()

	const handleSendMessage = (e: React.FormEvent) => {
		e.preventDefault()
		if (!input.trim()) return

		addMessages({ role: 'user', content: input })
		setInput('')
		aiChatbotMutation.mutate({
			messages,
			query: input,
			ep_number: episodeId as string,
			context: episodeContent?.context,
			ep_text: episodeContent?.de as string,
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
			addMessages({ role: 'assistant', content: aiResponse.response })
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

	return (
		<div className="mx-auto flex h-full max-w-2xl flex-col p-4">
			<h1 className="mb-4 text-2xl font-bold">AI Chatbot</h1>
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
						<div
							dangerouslySetInnerHTML={{
								__html: message.content.replaceAll('\n', '<br/>'),
							}}
							className={`max-w-[70%] rounded-lg p-3 ${message.role === 'assistant' ? 'bg-background' : 'bg-primary'}`}
						/>
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
			<div className="flex items-end">
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

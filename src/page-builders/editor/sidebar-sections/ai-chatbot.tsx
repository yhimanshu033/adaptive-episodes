/* eslint-disable @typescript-eslint/no-misused-promises */
'use client'

import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'next/navigation'
import useAIChatbotHook from '@/hooks/mutation/use-aichatbot-hook'
import useEpisodeContent from '@/hooks/query/use-episode-content'
import useAIStore, { addMessages } from '@/store/ai-store'
import { useSession } from 'next-auth/react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'

const AIChatbot = () => {
	const [input, setInput] = useState('')
	const messageEndRef = useRef<HTMLDivElement>(null)
	const { messages } = useAIStore()
	const { aiChatbotMutation } = useAIChatbotHook()
	const { data: aiResponse, isPending } = aiChatbotMutation
	const { data: userData } = useSession()
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
			context: episodeContent?.summary,
		})
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

	return (
		<div className="mx-auto flex h-full max-w-2xl flex-col">
			<h1 className="mb-4 text-2xl font-bold">AI Chatbot</h1>
			<ScrollArea className="mb-4 flex-1 rounded-md border p-4">
				{messages.map((message, index) => (
					<div
						key={index}
						className={`mb-4 flex items-start ${message.role === 'assistant' ? 'justify-start' : 'justify-end'}`}
					>
						{message.role === 'assistant' && (
							<Avatar className="mr-2">
								<AvatarImage src="/placeholder-ai.jpg" alt="AI" />
								<AvatarFallback>AI</AvatarFallback>
							</Avatar>
						)}
						<div
							className={`max-w-[70%] rounded-lg p-3 ${message.role === 'assistant' ? 'bg-background' : 'bg-primary'}`}
						>
							{message.content}
						</div>
						{message.role === 'user' && (
							<Avatar className="ml-2">
								<AvatarImage
									src={userData?.user?.image || '/placeholder-user.jpg'}
									alt="User"
								/>
								<AvatarFallback>U</AvatarFallback>
							</Avatar>
						)}
					</div>
				))}
				<div ref={messageEndRef} />
			</ScrollArea>
			<form onSubmit={handleSendMessage} className="flex space-x-2">
				<Input
					type="text"
					placeholder="Type your message..."
					value={input}
					onChange={(e) => setInput(e.target.value)}
					className="grow"
				/>
				<Button type="submit" disabled={isPending}>
					{isPending ? 'Sending...' : 'Send'}
				</Button>
			</form>
		</div>
	)
}

export default AIChatbot

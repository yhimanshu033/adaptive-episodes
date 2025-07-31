'use client'

import React, { useEffect, useRef } from 'react'
import useAIChatbot from '@/hooks/use-ai-chatbot'
import MessagesList from '@/page-builders/plate-editor/sidebar-sections/ai-chatbot/messages'
import Suggestions from '@/page-builders/plate-editor/sidebar-sections/ai-chatbot/suggestions'

import { Divider } from '@/components/aural-ui/divider'
import Image from '@/components/ui/image'

import ChatbotInput from './chatbot-input'

const AIChatbot = () => {
	const endRef = useRef<HTMLDivElement>(null)
	const { isPending } = useAIChatbot()

	useEffect(() => {
		if (endRef.current) {
			endRef.current.scrollIntoView({
				behavior: 'smooth',
				block: 'end',
			})
		}
	}, [])
	return (
		<>
			<div className="relative flex h-full min-h-full flex-col overflow-hidden py-4 text-clip">
				<Image
					alt="story chat gradient"
					className="pointer-events-none absolute top-0 right-0 z-0"
					src="/assets/story-chat-bg-gradient.png"
				/>
				<MessagesList isPending={isPending} />
				<Divider className="mb-3 opacity-80" variant="secondary" />
				<div className="px-4">
					<Suggestions />
					<ChatbotInput />
				</div>
			</div>
			<div ref={endRef} className="absolute bottom-0" />
		</>
	)
}

export default AIChatbot

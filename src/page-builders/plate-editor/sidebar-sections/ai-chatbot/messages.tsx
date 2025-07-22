import React, { useEffect, useRef } from 'react'
import useAiChatbotMessages from '@/hooks/use-ai-chatbot-messages'
import AILoader from '@/page-builders/plate-editor/sidebar-sections/ai-chatbot/ai-loader'
import { AILogo } from '@/page-builders/plate-editor/sidebar-sections/ai-chatbot/ai-logo'
import RenderMessage from '@/page-builders/plate-editor/sidebar-sections/ai-chatbot/render-messages'
import { UserLogo } from '@/page-builders/plate-editor/sidebar-sections/ai-chatbot/user-logo'

import { ScrollArea } from '@/components/ui/scroll-area'

import { EMessenger } from '@/types/ai-types'

const MessagesList = ({ isPending }: { isPending: boolean }) => {
	const { messages } = useAiChatbotMessages()

	const messageEndRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		if (messageEndRef.current) {
			messageEndRef.current.scrollIntoView({
				behavior: 'smooth',
				block: 'nearest',
			})
		}
	}, [messages])

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

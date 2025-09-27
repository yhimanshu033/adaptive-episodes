import React, { useEffect, useRef } from 'react'
import RenderMessage from '@/page-builders/plate-editor/sidebar-sections/ai-chatbot/messages/render-messages'
import useAIStore from '@/store/ai-store'
import { useShallow } from 'zustand/react/shallow'

import { Else, If, IfElse } from '@/components/aural-ui/if-else'
import { ScrollArea } from '@/components/aural-ui/scroll-area'
import ChatbotStatus from '@/components/chatbot-status'

import WelcomeMessage from './welcome-message'

const MessagesList = ({ isPending }: { isPending: boolean }) => {
	const { store } = useAIStore()
	const messages = store(useShallow((state) => state.messages))

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
		<div className="max-h-full flex-1">
			<ScrollArea
				className="h-full px-4"
				classes={{
					viewport: ' [&>div:first-child]:block! [&>div:first-child]:max-h-0 ',
				}}
			>
				<div className="flex flex-col">
					<IfElse condition={!!messages.length}>
						<If>
							{messages.map((message, index, msgs) => (
								<div key={index} className="mb-6">
									<RenderMessage
										message={message}
										index={index}
										isLast={index === msgs.length - 1}
									/>
								</div>
							))}
							<If condition={isPending}>
								<ChatbotStatus isRunning={true} />
							</If>
							<div ref={messageEndRef} />
						</If>
						<Else>
							<WelcomeMessage />
						</Else>
					</IfElse>

					<div ref={messageEndRef} />
				</div>
			</ScrollArea>
		</div>
	)
}

export default MessagesList

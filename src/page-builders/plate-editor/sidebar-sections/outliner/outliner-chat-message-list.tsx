import React, { useEffect, useRef } from 'react'
import OutlinerChatMessage from '@/page-builders/plate-editor/sidebar-sections/outliner/outliner-chat-message'
import useOutliner from '@/page-builders/plate-editor/sidebar-sections/outliner/provider'

import { ScrollArea } from '@/components/aural-ui/scroll-area'

export default function OutlinerChatMessagesList() {
	const { messages } = useOutliner()
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
				<div className="flex flex-col pt-4">
					{messages.map((message, index) => (
						<div key={index} className="mb-6">
							<OutlinerChatMessage message={message} />
						</div>
					))}
					{/* <If condition={isPending}>
                                <ChatbotStatus />
                            </If> */}
					<div ref={messageEndRef} />

					<div ref={messageEndRef} />
				</div>
			</ScrollArea>
		</div>
	)
}

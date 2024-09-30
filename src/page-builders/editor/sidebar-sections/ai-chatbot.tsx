import React from 'react'

import { Button } from '@/components/ui/button'

const AiChatbot = () => {
	return (
		<div className="space-y-4">
			<h1>AI Assistant</h1>
			<div className="rounded p-2">
				Hello! How can I assist you with your writing today?
			</div>
			<textarea
				className="w-full rounded border bg-transparent p-2"
				rows={3}
				placeholder="Type your message here..."
			></textarea>
			<Button className="w-full">Send</Button>
		</div>
	)
}

export default AiChatbot

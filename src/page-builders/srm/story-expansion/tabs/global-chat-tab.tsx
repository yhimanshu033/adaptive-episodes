'use client'

import React from 'react'

import useStoryExpansion from '../provider'
import ChatTabUI from './chat-tab-ui'

export default function GlobalChatTab() {
	const {
		globalChatMessages,
		globalChatInput,
		setGlobalChatInput,
		handleSendGlobalChatMessage,
		isSendingGlobalChatMessage,
	} = useStoryExpansion()

	return (
		<ChatTabUI
			messages={globalChatMessages}
			input={globalChatInput}
			setInput={setGlobalChatInput}
			handleSendMessage={handleSendGlobalChatMessage}
			isSendingMessage={isSendingGlobalChatMessage}
			emptyStateMessage="Start a conversation to make changes to fields"
		/>
	)
}

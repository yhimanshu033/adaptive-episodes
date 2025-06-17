'use client'

import React, { useEffect, useRef } from 'react'
import useAIChatbot from '@/hooks/use-ai-chatbot'
import ChatClearAlert from '@/page-builders/plate-editor/sidebar-sections/ai-chatbot/alert'
import MessagesList from '@/page-builders/plate-editor/sidebar-sections/ai-chatbot/messages'
import Suggestions from '@/page-builders/plate-editor/sidebar-sections/ai-chatbot/suggestions'
import { Send, StopCircle } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

const AIChatbot = () => {
	const dict = useTranslations('placeholders')
	const textareaRef = useRef<HTMLTextAreaElement>(null)
	const endRef = useRef<HTMLDivElement>(null)
	const {
		disabled,
		isPending,
		handleKeyDown,
		handleSendMessage,
		input,
		setInput,
		cancelRequest,
	} = useAIChatbot()
	useEffect(() => {
		if (textareaRef.current) {
			textareaRef.current.style.height = '40px'
			const scrollHeight = textareaRef.current.scrollHeight
			textareaRef.current.style.height = `${Math.min(scrollHeight, 150)}px`
		}
	}, [input])

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
			<div className="flex h-full flex-1 flex-col px-4 py-4 text-clip">
				<MessagesList isPending={isPending} />
				<Suggestions />
				<div className="flex flex-[0_0_auto] items-end gap-1">
					<form
						onSubmit={handleSendMessage}
						className="bg-background flex flex-1 items-end space-x-2 rounded-md border"
					>
						<Textarea
							ref={textareaRef}
							placeholder={dict('enterMessage')}
							disabled={disabled}
							value={input}
							onChange={(e) => setInput(e.target.value)}
							onKeyDown={handleKeyDown}
							className="grow resize-none overflow-y-auto border-none bg-transparent px-3 py-2 leading-relaxed outline-hidden focus-visible:border-none focus-visible:ring-0 focus-visible:ring-offset-0"
						/>
						{disabled ? (
							<Button
								variant="ghost"
								size="icon"
								type="button"
								tooltip="Cancel Request"
								onClick={cancelRequest}
							>
								<StopCircle size={16} />
							</Button>
						) : (
							<Button
								tooltip="Send Message"
								variant="ghost"
								size="icon"
								type="submit"
							>
								<Send size={16} />
							</Button>
						)}
					</form>
					<ChatClearAlert />
				</div>
			</div>
			<div ref={endRef} className="absolute bottom-0" />
		</>
	)
}

export default AIChatbot

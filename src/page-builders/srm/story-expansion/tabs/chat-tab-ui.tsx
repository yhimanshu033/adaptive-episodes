'use client'

import React, { useEffect, useRef } from 'react'
import ArrowRightIcon from '@/icons/arrow-right-icon'
import { useSpeechToText } from '@/page-builders/episodes/outliner-questionnaire/lib/hooks/use-speech-to-text'
import { Mic } from 'lucide-react'

import CircularLoader from '@/components/aural-ui/circular-loader'
import { Divider } from '@/components/aural-ui/divider'
import { IconButton } from '@/components/aural-ui/icon-button'
import { ScrollArea } from '@/components/aural-ui/scroll-area'
import TextArea from '@/components/aural-ui/textarea'
import { cn } from '@/lib/aural-ui/utils'

import { TMessage } from '../lib/types'

export interface IChatTabUIProps {
	emptyStateMessage?: string
	handleSendMessage: () => void
	input: string
	isSendingMessage: boolean
	messages: TMessage[]
	setInput: (value: string) => void
}

export default function ChatTabUI({
	messages,
	input,
	setInput,
	handleSendMessage,
	isSendingMessage,
	emptyStateMessage = 'Start a conversation with AI',
}: IChatTabUIProps) {
	const {
		startRecording,
		stopRecording,
		isLoading: isSpeechToTextLoading,
		orderedTranscript,
		isRecording,
	} = useSpeechToText()

	const messagesEndRef = useRef<HTMLDivElement>(null)
	const textareaRef = useRef<HTMLTextAreaElement>(null)

	useEffect(() => {
		if (messagesEndRef.current) {
			messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
		}
	}, [messages])

	useEffect(() => {
		if (!orderedTranscript) {
			return
		}
		setInput(orderedTranscript)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [orderedTranscript])

	const handleSubmit = () => {
		stopRecording()
		handleSendMessage()
	}

	const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === 'Enter' && !e.shiftKey && hasText) {
			e.preventDefault()
			handleSubmit()
		}
	}

	const hasText = input.trim().length > 0
	const disabled = isSendingMessage || isSpeechToTextLoading

	return (
		<div className="grid h-full grid-rows-[1fr_auto_auto] overflow-hidden">
			<ScrollArea className="h-full overflow-auto px-4">
				<div className="flex flex-col gap-4 py-4">
					{messages.length === 0 ? (
						<div className="text-fm-tertiary py-8 text-center">
							<p className="text-fm-md">{emptyStateMessage}</p>
						</div>
					) : (
						messages.map((message) => (
							<div
								key={message.id}
								className={cn(
									'flex',
									message.role === 'user' ? 'justify-end' : 'justify-start'
								)}
							>
								<div
									className={cn(
										'max-w-[80%] rounded-lg p-3',
										message.role === 'user'
											? 'bg-fm-primary text-fm-surface-secondary'
											: 'bg-fm-surface-secondary text-fm-primary'
									)}
								>
									<p className="text-fm-md whitespace-pre-wrap">
										{message.content}
									</p>
								</div>
							</div>
						))
					)}
					{isSendingMessage && (
						<div className="flex justify-start">
							<div className="bg-fm-surface-secondary text-fm-primary rounded-lg p-3">
								<p className="text-fm-md">AI is thinking...</p>
							</div>
						</div>
					)}
					<div ref={messagesEndRef} />
				</div>
			</ScrollArea>

			<Divider className="mx-4" />
			<div className="space-y-4 p-4">
				<div className="flex items-center gap-2">
					<TextArea
						ref={textareaRef}
						value={input}
						onChange={(e) => setInput(e.target.value)}
						onKeyDown={handleKeyDown}
						placeholder="Type your message..."
						decoration="outline"
						autoGrow
						minHeight={40}
						maxHeight={120}
						className="flex-1"
					/>
					<IconButton
						type="button"
						label={isRecording ? 'Stop Recording' : 'Talk it Out'}
						tooltip={isRecording ? 'Stop Recording' : 'Talk it Out'}
						onClick={() => {
							if (isRecording) {
								stopRecording()
							} else {
								void startRecording()
							}
						}}
						disabled={disabled}
						className={cn(
							'transition-all duration-200',
							{
								'border-fm-divider-primary bg-transparent': disabled,
							},
							{
								'bg-fm-primary hover:bg-fm-primary': !isSpeechToTextLoading,
							},
							{
								'bg-fm-secondary-800 hover:bg-fm-secondary-800':
									isRecording || isSpeechToTextLoading,
							}
						)}
						variant={!disabled ? 'ghost' : 'outlined'}
						icon={
							isSpeechToTextLoading ? (
								<CircularLoader className={cn('size-4')} />
							) : (
								<Mic
									width={18}
									height={18}
									className={cn(
										'text-fm-divider-primary transition-colors duration-200',
										disabled ? 'text-fm-contrast' : ''
									)}
								/>
							)
						}
					/>
					<IconButton
						onClick={handleSubmit}
						disabled={!hasText || disabled}
						variant="outlined"
						icon={<ArrowRightIcon width={16} height={16} />}
						label="Send"
					/>
				</div>
			</div>
		</div>
	)
}

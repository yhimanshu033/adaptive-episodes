import React from 'react'
import useAiChatbotMessages from '@/hooks/use-ai-chatbot-messages'
import useSocketStreaming from '@/hooks/use-socket-streaming'
import { CheckCheck, Copy, X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { cn, extract } from '@/lib/utils/helpers'

import { EAction, EMessenger, TMessage } from '@/types/ai-types'

export default function RenderMessage({
	message,
	index,
}: {
	index: number
	message: TMessage
}) {
	const { handleAccept } = useAiChatbotMessages()
	const { taskEnded, responses } = useSocketStreaming()
	if (
		message.role === EMessenger.ASSISTANT &&
		(message.action === EAction.CHANGES || message.action === EAction.VOICE)
	) {
		if (taskEnded[message.taskId]) {
			return (
				<div className="flex max-w-[70%] items-center gap-2 rounded-lg p-3">
					<Button
						variant="outline"
						onClick={() =>
							handleAccept(index, true, message.action === EAction.CHANGES)
						}
					>
						<CheckCheck />
					</Button>
					<Button
						variant="outline"
						onClick={() =>
							handleAccept(index, false, message.action === EAction.CHANGES)
						}
					>
						<X />
					</Button>
				</div>
			)
		}
		return (
			<div
				dangerouslySetInnerHTML={{
					__html: message.content,
				}}
				className={cn(
					'max-w-[70%] rounded-lg p-3',
					message.role === EMessenger.ASSISTANT ? 'bg-background' : 'bg-primary'
				)}
			/>
		)
	}
	if (
		message.role === EMessenger.ASSISTANT &&
		message.action === EAction.BLOCK
	) {
		if ((responses[message.taskId] || []).length) {
			return (
				<div className="relative flex max-w-[70%]">
					<div
						onClick={() => {
							void navigator.clipboard.writeText(
								extract((responses[message.taskId] || []).join(''))
							)
						}}
						dangerouslySetInnerHTML={{
							__html: (responses[message.taskId] || [])
								.join('')
								.replaceAll('\n', '<br/>')
								.replace(
									/<text>/g,
									"<span class='bg-background-editor rounded-md'>"
								)
								.replace(/<\/text>/g, '</span>'),
						}}
						className={cn(
							'flex-1 rounded-lg p-3 transition-transform *:animate-in active:scale-[0.995]',
							message.role === EMessenger.ASSISTANT
								? 'bg-background'
								: 'bg-primary'
						)}
					/>
					{taskEnded[message.taskId] &&
						!!extract((responses[message.taskId] || []).join('')).trim()
							.length && (
							<Button
								tooltip="Copy"
								onClick={() => {
									void navigator.clipboard.writeText(
										extract((responses[message.taskId] || []).join(''))
									)
								}}
								variant="ghost"
								className="sticky top-1 m-1 size-6 !p-1 transition-all hover:scale-105 active:scale-75"
							>
								<Copy size={16} />
							</Button>
						)}
				</div>
			)
		}
		return (
			<div
				dangerouslySetInnerHTML={{
					__html: 'Denke nach...',
				}}
				className={cn(
					'max-w-[70%] rounded-lg p-3',
					message.role === EMessenger.ASSISTANT ? 'bg-background' : 'bg-primary'
				)}
			/>
		)
	}
	return (
		<div
			dangerouslySetInnerHTML={{
				__html: message.content.replaceAll('\n', '<br/>'),
			}}
			className={cn(
				'max-w-[70%] rounded-lg p-3',
				message.role === EMessenger.ASSISTANT ? 'bg-background' : 'bg-primary'
			)}
		/>
	)
}

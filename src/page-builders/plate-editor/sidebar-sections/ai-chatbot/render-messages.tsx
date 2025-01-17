import React from 'react'
import useAiChatbotMessages from '@/hooks/use-ai-chatbot-messages'
import useSocketStreaming from '@/hooks/use-socket-streaming'
import { Check, CheckCheck, Copy, X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { TooltipComponent } from '@/components/ui/tooltip-component'
import { cn, extract } from '@/lib/utils/helpers'

import { EAction, EMessenger, TMessage } from '@/types/ai-types'

export default function RenderMessage({
	message,
	index,
}: {
	index: number
	message: TMessage
}) {
	const { handleAccept, handleReject } = useAiChatbotMessages()
	const { taskEnded, responses } = useSocketStreaming()
	if (
		message.role === EMessenger.ASSISTANT &&
		message.action === EAction.CHANGES
	) {
		if (taskEnded[message.taskId]) {
			return (
				<div className="flex max-w-[70%] gap-2 rounded-lg p-3">
					<TooltipComponent tooltip={'Done'}>
						<Button onClick={() => handleAccept(index, false)}>
							<Check />
						</Button>
					</TooltipComponent>
					<TooltipComponent tooltip={'Accept All'}>
						<Button variant="outline" onClick={() => handleAccept(index, true)}>
							<CheckCheck />
						</Button>
					</TooltipComponent>
					<TooltipComponent tooltip={'Reject All'}>
						<Button variant="outline" onClick={() => handleReject(index)}>
							<X />
						</Button>
					</TooltipComponent>
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
				<div className="relative max-w-[70%]">
					{taskEnded[message.taskId] &&
						!!extract((responses[message.taskId] || []).join('')).trim()
							.length && (
							<TooltipComponent tooltip={'Copy'}>
								<Button
									onClick={() => {
										void navigator.clipboard.writeText(
											extract((responses[message.taskId] || []).join(''))
										)
									}}
									variant="ghost"
									className="absolute -right-1 top-1 size-6 translate-x-full !p-1 transition-all hover:scale-105 active:scale-75"
								>
									<Copy size={12} />
								</Button>
							</TooltipComponent>
						)}
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
							'rounded-lg p-3 transition-transform *:animate-in active:scale-[0.995]',
							message.role === EMessenger.ASSISTANT
								? 'bg-background'
								: 'bg-primary'
						)}
					/>
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

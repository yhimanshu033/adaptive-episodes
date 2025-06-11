import React from 'react'
import useAiChatbotMessages from '@/hooks/use-ai-chatbot-messages'
import useSocketStreaming from '@/hooks/use-socket-streaming'
import { CheckCheck, Copy, X } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { If } from '@/components/if-else'
import { StoryAccordion } from '@/components/render-content'
import { Button } from '@/components/ui/button'
import {
	cn,
	extract,
	handleToolTags,
	hasToolResult,
	parseOptimistically,
} from '@/lib/utils/helpers'

import {
	EAction,
	EMessenger,
	PlotExplorerApiResponse,
	TMessage,
} from '@/types/ai-types'

export default function RenderMessage({
	message,
	index,
}: {
	index: number
	message: TMessage
}) {
	const { handleAccept } = useAiChatbotMessages()
	const { taskEnded, responses } = useSocketStreaming()
	const dict = useTranslations('placeholders')

	if (
		message.role === EMessenger.ASSISTANT &&
		(message.action === EAction.CHANGES || message.action === EAction.VOICE)
	) {
		if (taskEnded[message.taskId]) {
			return (
				<div className="flex max-w-[70%] items-center gap-2 rounded-lg p-3">
					<Button
						tooltip="Accept"
						variant="outline"
						onClick={() =>
							handleAccept(index, true, message.action === EAction.CHANGES)
						}
					>
						<CheckCheck />
					</Button>
					<Button
						variant="outline"
						tooltip="Reject"
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
			return !hasToolResult(responses[message.taskId]) ? (
				<div className="relative flex">
					<div
						onClick={() => {
							void navigator.clipboard.writeText(
								extract((responses[message.taskId] || []).join(''))
							)
						}}
						dangerouslySetInnerHTML={{
							__html: handleToolTags(responses[message.taskId] || [], true)
								.replaceAll('\n', '<br/>')
								.replace(
									/<text>/g,
									"<span class='bg-background-editor rounded-md'>"
								)
								.replace(/<\/text>/g, '</span>'),
						}}
						className={cn(
							'*:animate-in max-w-[70%] flex-1 rounded-lg p-3 transition-transform active:scale-[0.995]',
							message.role === EMessenger.ASSISTANT
								? 'bg-background'
								: 'bg-primary'
						)}
					/>
					<If
						condition={
							taskEnded[message.taskId] &&
							!!extract((responses[message.taskId] || []).join('')).trim()
								.length
						}
					>
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
					</If>
				</div>
			) : (
				<StoryAccordion
					className="*:animate-in max-w-[70%] flex-1 rounded-lg p-3 transition-transform active:scale-[0.995]"
					explorerData={
						parseOptimistically<PlotExplorerApiResponse['data']>(
							handleToolTags(responses[message.taskId])
						) ?? ''
					}
				/>
			)
		}
		return (
			<div
				dangerouslySetInnerHTML={{
					__html: dict('thinking'),
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

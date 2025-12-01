import React, { useMemo } from 'react'
import { EFeedback } from '@/constants/analytics'
import useSocketStreaming from '@/hooks/use-socket-streaming'
import { AiAvatarIcon } from '@/icons/ai-avatar-icon'
import { getDerivedChatMessageContent } from '@/page-builders/episodes/outliner-questionnaire/lib/fns'
import { TPostOutlinerQuestionnaireChatResponse } from '@/page-builders/episodes/outliner-questionnaire/lib/types'
import useOutlinerQuestionnaire from '@/page-builders/episodes/outliner-questionnaire/provider'
import { StreamedResponseWithCopy } from '@/page-builders/plate-editor/sidebar-sections/ai-chatbot/messages/block-message'

import { If } from '@/components/aural-ui/if-else'
import { OutlinerFeedback } from '@/components/outliner-feedback'
import { cn } from '@/lib/aural-ui/utils'
import { parseOptimistically } from '@/lib/utils/helpers'

import { EMessenger, TMessage } from '@/types/ai-types'

export default function OutlinerQuestionnaireChatMessage({
	message,
	isLast,
}: {
	isLast?: boolean
	message: TMessage
}) {
	const { responses, taskEnded } = useSocketStreaming()
	const { completedTaskId, handleChatFeedback } = useOutlinerQuestionnaire()

	const aiContent = useMemo(() => {
		const fallbackMessage = message.content ? [message.content] : []
		if (
			message.role !== EMessenger.ASSISTANT ||
			!message.taskId ||
			message.content ||
			!responses[message.taskId]
		) {
			return fallbackMessage
		}
		const response = responses[message.taskId]
		const parsed = response.map(
			parseOptimistically
		) as TPostOutlinerQuestionnaireChatResponse[]

		const derivedMessage = getDerivedChatMessageContent(parsed)
		return derivedMessage
	}, [responses, message])

	if (message.role === EMessenger.USER) {
		return (
			<div
				dangerouslySetInnerHTML={{
					__html: message.content.trim().replaceAll('\n', '<br/>'),
				}}
				className={cn(
					'text-fm-lg bg-fm-surface-secondary w-fit rounded-sm p-3'
				)}
			/>
		)
	}

	if (!aiContent.length) {
		return null
	}

	const taskId = message.taskId
	const isTaskCompleted = !taskId || taskEnded[taskId]
	const showFeedback = !!completedTaskId.chat && isLast && isTaskCompleted

	return (
		<div>
			<AiAvatarIcon className="h-6 w-6" />
			<StreamedResponseWithCopy
				responses={aiContent}
				taskId={taskId}
				taskEnded={isTaskCompleted}
			/>
			<If condition={showFeedback}>
				<div className="mt-2">
					<OutlinerFeedback
						onLike={(comment) =>
							handleChatFeedback(completedTaskId.chat, EFeedback.LIKE, comment)
						}
						onDislike={(comment) =>
							handleChatFeedback(
								completedTaskId.chat,
								EFeedback.DISLIKE,
								comment
							)
						}
					/>
				</div>
			</If>
		</div>
	)
}

import { EAction, EMessenger, TMessage } from '@/types/ai-types'

export const aiInitialMessage: TMessage[] = [
	{
		role: EMessenger.ASSISTANT,
		content: 'Wie kann ich dir heute beim Überarbeiten helfen?',
		action: EAction.MESSAGE,
	},
]
export enum AiDiffOperation {
	DELETE = 'delete',
	INSERT = 'insert',
	UPDATE = 'update',
}

export enum DiffStatus {
	ACCEPTED = 'accepted',
	PENDING = 'pending',
	REJECTED = 'rejected',
}

export enum LocalizationType {
	CONCEPT = 'concept',
	PERSON = 'character',
	PLACE = 'place',
}

export const quickPrompts = [
	'Give me the summary of the episode',
	'Give me the background of character',
	'What is the setting of the episode?',
	'How does the episode end?',
	'Give me the conflict of the episode',
	'Give me the resolution of the episode',
]

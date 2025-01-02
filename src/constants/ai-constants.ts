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
	'Analysiere die dramaturgischen Beats dieser Episode und zeige auf, wo die dramatische Spannung nachlässt oder gesteigert werden sollte.',
	'Überprüfe die Dialogszenen und mache Vorschläge zu “character-revealing inner thoughts, more theatrical exchanges, and heightened emotional stakes"',
	'Identifiziere Momente, in denen Konflikte zwischen den Charakteren intensiviert werden könnten, und schlage Möglichkeiten vor, ihre Dynamik dramatischer zu gestalten, ohne die Kernhandlung zu ändern.',
	'Zeichne die emotionale Entwicklung des Protagonisten in dieser Episode nach und verstärke seine Reaktionen, wobei der Fokus auf äußeren Hindernissen statt auf inneren Schwächen liegt.',
	'Überprüfe den Anfang/das Ende dieser Episode und schlageMöglichkeiten vor, einen spannenderen Hook oder Cliffhanger zu schaffen, der sofort Spannung aufbaut.',
]

import {
	EAction,
	EMessenger,
	TLocalizeResponse,
	TMessage,
} from '@/types/ai-types'

export const aiInitialMessage: TMessage[] = [
	{
		role: EMessenger.ASSISTANT,
		content: 'Wie kann ich dir heute beim Überarbeiten helfen?',
		action: EAction.MESSAGE,
		taskId: '1',
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
	OBJECT = 'object',
	PERSON = 'character',
	PLACE = 'place',
}

export const localizationTypes: (keyof typeof LocalizationType)[] = [
	'PERSON',
	'PLACE',
	'CONCEPT',
	'OBJECT',
]

export const typeToKey: Record<
	keyof typeof LocalizationType,
	keyof TLocalizeResponse['result']
> = {
	CONCEPT: 'concepts',
	OBJECT: 'objects',
	PERSON: 'characters',
	PLACE: 'places',
}

export const typeToLocalizedKey: Record<keyof typeof LocalizationType, string> =
	{
		CONCEPT: 'localized_concept',
		OBJECT: 'localized_object',
		PERSON: 'localized_name',
		PLACE: 'localized_place',
	}

export enum ESocketStatus {
	COMPLETED = 'completed',
	STARTED = 'started',
}

export const QUICK_PROMPTS = [
	'Analysiere die dramaturgischen Beats dieser Episode und zeige auf, wo die dramatische Spannung nachlässt oder gesteigert werden sollte.',
	'Überprüfe die Dialogszenen und mache Vorschläge zu “character-revealing inner thoughts, more theatrical exchanges, and heightened emotional stakes"',
	'Identifiziere Momente, in denen Konflikte zwischen den Charakteren intensiviert werden könnten, und schlage Möglichkeiten vor, ihre Dynamik dramatischer zu gestalten, ohne die Kernhandlung zu ändern.',
	'Zeichne die emotionale Entwicklung des Protagonisten in dieser Episode nach und verstärke seine Reaktionen, wobei der Fokus auf äußeren Hindernissen statt auf inneren Schwächen liegt.',
	'Überprüfe den Anfang/das Ende dieser Episode und schlageMöglichkeiten vor, einen spannenderen Hook oder Cliffhanger zu schaffen, der sofort Spannung aufbaut.',
	'Umzuschreibender Absatz:\n[INSERT PARAGRAPH]\n\n###\nBitte schreibe den obigen Absatz um, ergänze mehr farbenfrohe Beschreibungen hinzu und behalte dabei das Tempo bei. Füge während an den entsprechenden Momenten Hinweise für Musik und Soundeffekte ein – aber auf Englisch in diesem Format: SFX:  MUSIC: \n\nRewrite Guidelines: \n- direkte Rede immer in Du-Form und jede Figur mit ihrer eigenen Umgangssprache \n- schreibe im Aktiv \n- verbessere die Lesbarkeit des Textes durch gute Grammatik - vermeide Partizipien',
]

export const AI_USER_ID = 'COPILOT-AI'

export enum ELlmWriterMode {
	CLONE = 'clone',
	SPIN_OFF = 'spin-off',
}

export const SFX_INFO = {
	SINGLE_TICK:
		'Nur ausgewählte SFX-Vorschläge annehmen (Auswahl: entsprechende SFX-Tags anklicken und durch Klick auf den Haken der Auswahl hinzufügen)',
	DOUBLE_TICK: 'Alle SFX-Vorschläge annehmen',
	CROSS: 'Vorschläge verwerfen',
}

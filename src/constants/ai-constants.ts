import { FindReplaceConfig } from '@/lib/plate/plugins/find-replace'

import {
	EAction,
	EMessenger,
	TLocalizeResponse,
	TMessage,
	TQuickPrompt,
} from '@/types/ai-types'
import {
	ELanguage,
	ELSMappingChineseGender,
	ELSMappingGender,
	ELSMappingType,
	LSMappingOutputItem,
	TSourceLanguage,
} from '@/types/common'
import { ESidebar } from '@/types/plate-types'

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
	Concept = 'concept',
	Object = 'object',
	Person = 'character',
	Place = 'place',
}

export const localizationTypes: (keyof typeof LocalizationType)[] = [
	'Person',
	'Place',
	'Concept',
	'Object',
]

export const typeToKey: Record<
	keyof typeof LocalizationType,
	keyof TLocalizeResponse['result']
> = {
	Concept: 'concepts',
	Object: 'objects',
	Person: 'characters',
	Place: 'places',
}

export const typeToLocalizedKey: Record<keyof typeof LocalizationType, string> =
	{
		Concept: 'localized_concept',
		Object: 'localized_object',
		Person: 'localized_name',
		Place: 'localized_place',
	}

export enum ESocketStatus {
	COMPLETED = 'completed',
	STARTED = 'started',
}

export const QUICK_PROMPTS: Array<TQuickPrompt> = [
	{
		title: 'Beat-Analyse',
		text: 'Analysiere die dramaturgischen Beats dieser Episode und zeige auf, wo die dramatische Spannung nachlässt oder gesteigert werden sollte.',
	},
	{
		title: 'Dialog-Enhancement',
		text: 'Überprüfe die Dialogszenen und mache Vorschläge zu "character-revealing inner thoughts, more theatrical exchanges, and heightened emotional stakes"',
	},
	{
		title: 'Konfliktintensivierung',
		text: 'Identifiziere Momente, in denen Konflikte zwischen den Charakteren intensiviert werden könnten, und schlage Möglichkeiten vor, ihre Dynamik dramatischer zu gestalten, ohne die Kernhandlung zu ändern.',
	},
	{
		title: 'Charakterentwicklung & Reaktionsverstärkung',
		text: 'Zeichne die emotionale Entwicklung des Protagonisten in dieser Episode nach und verstärke seine Reaktionen, wobei der Fokus auf äußeren Hindernissen statt auf inneren Schwächen liegt.',
	},
	{
		title: 'Hook & Cliffhanger Optimierung',
		text: 'Überprüfe den Anfang/das Ende dieser Episode und schlageMöglichkeiten vor, einen spannenderen Hook oder Cliffhanger zu schaffen, der sofort Spannung aufbaut.',
	},
	{
		title: 'Rewrite (Stylize)',
		text: 'Umzuschreibender Absatz:\n[INSERT PARAGRAPH]\n\n###\nBitte schreibe den obigen Absatz um, ergänze mehr farbenfrohe Beschreibungen hinzu und behalte dabei das Tempo bei. Füge während an den entsprechenden Momenten Hinweise für Musik und Soundeffekte ein – aber auf Englisch in diesem Format: SFX:  MUSIC: \n\nRewrite Guidelines: \n- direkte Rede immer in Du-Form und jede Figur mit ihrer eigenen Umgangssprache \n- schreibe im Aktiv \n- verbessere die Lesbarkeit des Textes durch gute Grammatik - vermeide Partizipien',
	},
	{
		title: 'Dramaturgie-Schwachstellen & Logik-Check',
		text: 'Plot holes, dramaturgische schwächen und Logische Fehler auflisten - mit kurzem Textanker, um sie zu finden',
	},
	{
		title: 'Retention Writer Prompt',
		text: 'Bitte schreibe den folgenden Abschnitt um. Bleibe nah am Original und erfinde nichts dazu - aber straffe nicht zu sehr.\nAußerdem achte darauf, keinen Nominalstil oder Passiv zu verwenden, sondern leicht lesbare Sätze. Unser Ziel ist es, das Original so gut wie möglich zu verbessern. Der überarbeitete Text soll flüssiger und atmosphärischer geschrieben sein. Die Spannung und die Emotionen der Charaktere sollen besser zur Geltung kommen. Der Text muss alle wichtigen Handlungselemente beibehalten, sie aber in einer fesselnderen und lebendigeren Weise präsentieren. Einige Hauptpunkte der Verbesserung sind:\nBildlicher und atmosphärischer Stil.\nStraffung redundanter Informationen\nVerstärkung der inneren Konflikte, besonders bei Sen\nLebhaftere Dialoge und Reaktionen\nBessere Übergänge zwischen den Szenen\n###\n(ABSCHNITT REINKOPIEREN)',
	},
]

export const QUICK_PROMPTS_EN: Array<TQuickPrompt> = [
	{
		title: 'Beat Analysis',
		text: 'Analyze the dramatic beats of this episode and highlight where the dramatic tension decreases or should be increased.',
	},
	{
		title: 'Dialogue Enhancement',
		text: 'Review the dialogue scenes and suggest improvements for "character-revealing inner thoughts, more theatrical exchanges, and heightened emotional stakes."',
	},
	{
		title: 'Conflict Intensification',
		text: 'Identify moments where conflicts between characters could be intensified, and suggest ways to make their dynamics more dramatic without changing the core plot.',
	},
	{
		title: 'Character Development & Reaction Enhancement',
		text: 'Trace the emotional development of the protagonist in this episode and enhance their reactions, focusing on external obstacles rather than internal weaknesses.',
	},
	{
		title: 'Hook & Cliffhanger Optimization',
		text: 'Review the beginning/end of this episode and suggest ways to create a more exciting hook or cliffhanger that immediately builds suspense.',
	},
	{
		title: 'Rewrite (Stylize)',
		text: 'Paragraph to be rewritten:\n[INSERT PARAGRAPH]\n\n###\nPlease rewrite the paragraph above, adding more colorful descriptions while maintaining the pace. Insert hints for music and sound effects at appropriate moments — in English, in this format: SFX:  MUSIC: \n\nRewrite Guidelines:\n- Always use the "you" form for direct speech, with each character having their own distinct voice\n- Write in active voice\n- Improve readability with good grammar – avoid participles',
	},
	{
		title: 'Dramaturgical Weaknesses & Logic Check',
		text: 'List plot holes, dramaturgical weaknesses, and logical errors — with a short text anchor to locate them.',
	},
	{
		title: 'Retention Writer Prompt',
		text: 'Please rewrite the following section. Stay close to the original and do not add anything — but do not overly condense it.\nAlso, make sure to avoid nominal style or passive voice, and use easily readable sentences. Our goal is to improve the original as much as possible. The revised text should flow more smoothly and be written in a more atmospheric style. The tension and emotions of the characters should come through better. The text must retain all important plot elements but present them in a more captivating and lively way. Key points of improvement include:\nVivid and atmospheric style\nStreamlining redundant information\nEnhancing internal conflicts, especially for Sen\nMore vivid dialogues and reactions\nBetter transitions between scenes\n###\n(PASTE SECTION)',
	},
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

export const INITIAL_FAR_OPTIONS: FindReplaceConfig['options'] = {
	search: '',
	replace: '',
	replaceEnabled: true,
	currentId: [0, 0, 0],
	caseSensitive: false,
	wholeWord: false,
	genitive: false,
}

export const LSMappingGenders = [ELSMappingGender.MALE, ELSMappingGender.FEMALE]
export const LSMappingChineseGenders = [
	ELSMappingChineseGender.MALE,
	ELSMappingChineseGender.FEMALE,
]

export const LSMappingTypes = [ELSMappingType.PERSON, ELSMappingType.ENTITY]

export const sidebarToTitle: Record<ESidebar, string> = {
	[ESidebar.CHATBOT]: 'StoryChat',
	[ESidebar.COMMENTS]: 'Comments',
	[ESidebar.DUAL_VIEW]: '',
	[ESidebar.FAR]: 'Find and Replace',
	[ESidebar.NOTES]: 'Notes',
	[ESidebar.OUTLINE]: 'Story Explorer',
}

export const sidebarButtons: ESidebar[] = [ESidebar.CHATBOT, ESidebar.OUTLINE]

export const HIDE_SIDEBAR_HEADER: ESidebar[] = [ESidebar.FAR]

export const SAMPLE_LS_DATA: LSMappingOutputItem[] = [
	{
		type: 'person',
		original_name: '痞子赵',
		translated_name: 'Pìzǐ Zhào',
		google_translated_name: 'Ruffian Zhao',
		localised_name: 'Riley Zhao',
		localised_first_name: 'Riley',
		localised_last_name: 'Zhao',
		localised_nick_name: 'RJ',
		localised_title: 'N/A',
		gender: 'male',
		entity_type: '',
		linked_mentions: ['痞子赵', '作者痞子赵'],
		translated_linked_mentions: ['Pìzǐ Zhào', 'zuòzhě Pìzǐ Zhào'],
		is_overextracted: false,
		is_deleted: '',
	},
	{
		type: 'person',
		original_name: '作者痞子赵',
		translated_name: 'uzuòzhě pǐzi zhào',
		google_translated_name: 'Author: Ruffian Zhao',
		localised_name: 'Riley Zhao',
		localised_first_name: 'Riley',
		localised_last_name: 'Zhao',
		localised_nick_name: 'N/A',
		localised_title: 'Author',
		gender: 'male',
		entity_type: '',
		linked_mentions: ['痞子赵', '作者痞子赵'],
		translated_linked_mentions: ['pǐzi zhào', 'uzuòzhě pǐzi zhào'],
		is_overextracted: false,
		is_deleted: '',
	},
	{
		type: 'person',
		original_name: '张北北',
		translated_name: 'Zhang Beibei',
		google_translated_name: 'Zhang Beibei',
		localised_name: 'Alex Miller',
		localised_first_name: 'Alex',
		localised_last_name: 'Miller',
		localised_nick_name: 'N/A',
		localised_title: 'N/A',
		gender: 'neutral',
		entity_type: '',
		linked_mentions: ['描线张北北', '张北北'],
		translated_linked_mentions: ['描线 Zeng Beibei', 'Zhang Beibei'],
		is_overextracted: false,
		is_deleted: '',
	},
	{
		type: 'person',
		original_name: '描线张北北',
		translated_name: 'Máo Xiàn Zhāng Běiběi',
		google_translated_name: 'Line drawing Zhang Beibei',
		localised_name: 'Alex Miller',
		localised_first_name: 'Alex',
		localised_last_name: 'Miller',
		localised_nick_name: 'N/A',
		localised_title: 'Inker',
		gender: 'neutral',
		entity_type: '',
		linked_mentions: ['描线张北北', '张北北'],
		translated_linked_mentions: ['Máo Xiàn Zhāng Běiběi', 'Zhāng Běiběi'],
		is_overextracted: false,
		is_deleted: '',
	},
	{
		type: 'person',
		original_name: '小美',
		translated_name: 'Xiăoměi',
		google_translated_name: 'Xiaomei',
		localised_name: 'Emily Smith',
		localised_first_name: 'Emily',
		localised_last_name: 'Smith',
		localised_nick_name: 'Emi',
		localised_title: 'N/A',
		gender: 'female',
		entity_type: '',
		linked_mentions: [],
		translated_linked_mentions: [],
		is_overextracted: false,
		is_deleted: '',
	},
] as unknown as LSMappingOutputItem[]

export const PREFERABLE_LANGUAGES: Record<TSourceLanguage, ELanguage> = {
	[ELanguage.ENGLISH]: ELanguage.GERMAN,
	[ELanguage.CHINESE]: ELanguage.ENGLISH,
	[ELanguage.GERMAN]: ELanguage.FRENCH,
	[ELanguage.HINDI]: ELanguage.ENGLISH,
	[ELanguage.KOREAN]: ELanguage.ENGLISH,
	[ELanguage.TRANSLATED_ENGLISH]: ELanguage.ENGLISH,
}

export const AVAILABLE_SOURCE_LANGUAGES: TSourceLanguage[] = []

export const AVAILABLE_TARGET_LANGUAGES: ELanguage[] = [
	ELanguage.ENGLISH,
	ELanguage.HINDI,
	ELanguage.ITALIAN,
	ELanguage.GERMAN,
	ELanguage.FRENCH,
	ELanguage.MEXICAN_SPANISH,
	ELanguage.NEUTRAL_SPANISH,
]

export const SOURCE_TO_TARGET_LANGUAGE_MAP: Partial<
	Record<ELanguage, ELanguage[]>
> = {
	[ELanguage.ENGLISH]: [
		ELanguage.GERMAN,
		ELanguage.FRENCH,
		ELanguage.NEUTRAL_SPANISH,
		ELanguage.MEXICAN_SPANISH,
		ELanguage.ITALIAN,
		ELanguage.HINDI,
	],
	[ELanguage.CHINESE]: [ELanguage.ENGLISH],
	[ELanguage.TRANSLATED_ENGLISH]: [ELanguage.ENGLISH],
	[ELanguage.KOREAN]: [ELanguage.ENGLISH],
	[ELanguage.GERMAN]: [ELanguage.ENGLISH, ELanguage.FRENCH],
	[ELanguage.HINDI]: [ELanguage.ENGLISH],
}

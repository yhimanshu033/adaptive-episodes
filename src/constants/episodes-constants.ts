import { ELanguage, EStatus } from '@/types/common'
import {
	ENotesAction,
	SaveEpisodeParams,
	TGetEpisodesResponse,
} from '@/types/episode-type'

export const statuses: EStatus[] = [
	EStatus.FIRST_DRAFT,
	EStatus.SECOND_DRAFT,
	EStatus.POLISH,
	EStatus.PUBLISHED,
]

export const languages: ELanguage[] = [
	ELanguage.ENGLISH,
	ELanguage.FRENCH,
	ELanguage.GERMAN,
	ELanguage.HINDI,
	ELanguage.ITALIAN,
	ELanguage.MEXICAN_SPANISH,
]

export const titleToStatus: Partial<Record<EStatus, string>> = {
	[EStatus.FIRST_DRAFT]: '🔴 1ST DRAFT',
	[EStatus.SECOND_DRAFT]: '🟡 REVIEW',
	[EStatus.POLISH]: '🟠 2ND DRAFT',
	[EStatus.PUBLISHED]: '🟢 CMS READY',
}

export const languageToTitle: Record<ELanguage, string> = {
	[ELanguage.ENGLISH]: 'English',
	[ELanguage.FRENCH]: 'French',
	[ELanguage.GERMAN]: 'German',
	[ELanguage.HINDI]: 'Hindi',
	[ELanguage.ITALIAN]: 'Italian',
	[ELanguage.MEXICAN_SPANISH]: 'Spanish (MX)',
}

export enum EpisodeActions {
	DELETE = 'delete',
	INVENT = 'invent',
	MERGE = 'merge',
	METATDATA = 'metadata',
	STATUS = 'status',
	UNMERGE = 'unmerge',
	UPDATE = 'update',
}

export const DEFAULT_EPISODE_LIMIT = 10

export const EPISODE_LIMITS: Array<number> = [5, 10, 25, 50, 100]

export const SIDEBAR_DISABLED = ['4008']

export const DEFAULT_EPISODES_DATA: TGetEpisodesResponse = {
	count: 0,
	next: null,
	previous: null,
	results: {
		data: [],
		message: '',
	},
}

export const PRIMARY_KEYS_TO_COMPARE: (keyof SaveEpisodeParams)[] = [
	'chapter_title',
	'text',
] as const

export const PROPS_KEYS_TO_COMPARE: (keyof SaveEpisodeParams)[] = [
	'comments',
] as const

export const UNASSIGNED_LABEL = 'Nicht zugewiesen'

export const notesMessages = {
	[ENotesAction.CREATE]: 'Erfolgreich zur Notiz hinzugefügt!',
	[ENotesAction.DELETE]: 'Notiz erfolgreich gelöscht!',
	[ENotesAction.UPDATE]: 'Hinweis erfolgreich aktualisiert!',
	[ENotesAction.DELETE_ALL]: 'Alle Notizen erfolgreich gelöscht!',
}

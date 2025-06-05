import {
	BASE_STATUS,
	ELanguage,
	EStatus,
	TSourceLanguage,
} from '@/types/common'
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
	ELanguage.FRENCH,
	ELanguage.GERMAN,
	ELanguage.ITALIAN,
	ELanguage.MEXICAN_SPANISH,
]

export const sourceLanguages: TSourceLanguage[] = [
	ELanguage.ENGLISH,
	ELanguage.HINDI,
	ELanguage.CHINESE,
	ELanguage.GERMAN,
	ELanguage.KOREAN,
	ELanguage.TRANSLATED_ENGLISH,
]

export const titleToStatus: Partial<Record<EStatus, string>> = {
	[EStatus.FIRST_DRAFT]: '🔴 1ST DRAFT',
	[EStatus.SECOND_DRAFT]: '🟡 REVIEW',
	[EStatus.POLISH]: '🟠 2ND DRAFT',
	[EStatus.PUBLISHED]: '🟢 CMS READY',
}

export const titleToStatusText: Partial<Record<EStatus, string>> = {
	[EStatus.FIRST_DRAFT]: '1ST DRAFT',
	[EStatus.SECOND_DRAFT]: 'REVIEW',
	[EStatus.POLISH]: '2ND DRAFT',
	[EStatus.PUBLISHED]: 'CMS READY',
}

export const languageToTitle: Record<ELanguage, string> = {
	[ELanguage.ENGLISH]: 'English',
	[ELanguage.FRENCH]: 'French',
	[ELanguage.GERMAN]: 'German',
	[ELanguage.HINDI]: 'Hindi',
	[ELanguage.ITALIAN]: 'Italian',
	[ELanguage.MEXICAN_SPANISH]: 'Spanish',
	[ELanguage.GERMAN_ORIGINAL]: 'German',
	[ELanguage.ENGLISH_US]: 'English',
	[ELanguage.CHINESE]: 'Chinese',
	[ELanguage.KOREAN]: 'Korean',
	[ELanguage.NEUTRAL_SPANISH]: 'Neutral Spanish',
	[ELanguage.TRANSLATED_ENGLISH]: 'Translated English',
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
	[ENotesAction.CREATE]: 'Note created successfully!',
	[ENotesAction.DELETE]: 'Note deleted successfully!',
	[ENotesAction.UPDATE]: 'Note updated successfully!',
	[ENotesAction.DELETE_ALL]: 'All nots deleted successfully!',
}

export const prioritizedStatuses = [
	EStatus.PUBLISHED,
	EStatus.POLISH,
	EStatus.SECOND_DRAFT,
	EStatus.FIRST_DRAFT,
]

export const allPrioritizedStatuses = [
	EStatus.PUBLISHED,
	EStatus.POLISH,
	EStatus.SECOND_DRAFT,
	EStatus.FIRST_DRAFT,
	BASE_STATUS,
]

export const DEFAULT_PAGE = 1

export const PAGE_PADDING = 3

export const PAGES_TO_SHOW = 5

export enum ImportStoryType {
	EMPTY = 'empty',
	IMPORT = 'import',
}

export enum ImportStoryStep {
	CHOOSE_TYPE = 'choose-type',
	CONTENT = 'content',
	DETAILS = 'details',
}

export const storySteps = [
	ImportStoryStep.CHOOSE_TYPE,
	ImportStoryStep.DETAILS,
	ImportStoryStep.CONTENT,
] as const
export const switchableStepsInfo: { title: string; type: ImportStoryStep }[] = [
	{ type: ImportStoryStep.DETAILS, title: 'Set up name' },
	{ type: ImportStoryStep.CONTENT, title: 'Import content' },
]

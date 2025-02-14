import { EStatus } from '@/types/common'
import { SaveEpisodeParams, TGetEpisodesResponse } from '@/types/episode-type'

export const statuses: EStatus[] = [
	EStatus.FIRST_DRAFT,
	EStatus.SECOND_DRAFT,
	EStatus.POLISH,
	EStatus.PUBLISHED,
]

export const titleToStatus: Partial<Record<EStatus, string>> = {
	[EStatus.FIRST_DRAFT]: '🔴 1ST DRAFT',
	[EStatus.SECOND_DRAFT]: '🟡 REVIEW',
	[EStatus.POLISH]: '🟠 2ND DRAFT',
	[EStatus.PUBLISHED]: '🟢 CMS READY',
}

export enum EpisodeActions {
	DELETE = 'delete',
	INVENT = 'invent',
	MERGE = 'merge',
	METATDATA = 'metadata',
	UNMERGE = 'unmerge',
	UPDATE = 'update',
}

export const DEFAULT_EPISODE_LIMIT = 10
export const EPISODE_LIMITS: Array<number> = [5, 10, 25, 50, 100]

export const SIDEBAR_DISABLED = ['4008']

export const EPISODE_CONTENT_QUERY_KEY = 'episode-content'
export const EPISODE_LIST_QUERY_KEY = 'episodes'

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

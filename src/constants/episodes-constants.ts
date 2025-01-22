import { EStatus } from '@/types/common'

export const statuses: EStatus[] = [
	EStatus.FIRST_DRAFT,
	EStatus.SECOND_DRAFT,
	EStatus.POLISH,
	EStatus.PUBLISHED,
]

export const titleToStatus: Partial<Record<EStatus, string>> = {
	[EStatus.FIRST_DRAFT]: '1ST DRAFT',
	[EStatus.SECOND_DRAFT]: 'REVIEW',
	[EStatus.POLISH]: '2ND  DRAFT',
	[EStatus.PUBLISHED]: 'CMS READY',
}

export enum EpisodeActions {
	DELETE = 'delete',
	INVENT = 'invent',
	MERGE = 'merge',
	METATDATA = 'metadata',
	UNMERGE = 'unmerge',
	UPDATE = 'update',
}

export const EPISODE_LIMIT = 10

export const SIDEBAR_DISABLED = ['4008']

export const EPISODE_CONTENT_QUERY_KEY = 'episode-content'

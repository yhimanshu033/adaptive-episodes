import { EStatus } from '@/types/common'

export const statuses: EStatus[] = [
	EStatus.FIRST_DRAFT,
	EStatus.SECOND_DRAFT,
	EStatus.POLISH,
	EStatus.PUBLISHED,
]

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

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
	UNMERGE = 'unmerge',
	UPDATE = 'update',
}

export const episodeLimit = 10

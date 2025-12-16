import { TGetStoriesResponse } from '@/types/story-types'

export const MAX_IMAGE_FILE_SIZE = 5 * 1024 * 1024
export const MAX_IMAGE_FILE_SIZE_25 = 25 * 1024 * 1024
export const ACCEPTED_IMAGE_TYPES = [
	'image/jpeg',
	'image/jpg',
	'image/png',
	'image/webp',
]
export const MAX_DOCX_FILE_SIZE = 10000000
export const MAX_DOCX_FILE_SIZE_100 = 100 * 1024 * 1024
export const ACCEPTED_DOCX_TYPES = [
	'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]

export enum EImportStatus {
	IMPORTED = 'IMPORTED',
	IMPORTING = 'IMPORTING',
}

export const DEFAULT_STORIES_RESPONSE: TGetStoriesResponse = {
	results: {
		data: [],
		message: '',
	},
	count: 0,
	next: null,
	previous: null,
}

export const CI_DIALOG_TITLE = {
	DEFAULT: 'Let’s get started',
	CREATE: 'Create new series',
	CMS: 'Import from CMS',
}

import { TDiscussion } from '@/components/editor/plugins/discussion-kit'

import { BASE_STATUS, ELanguage, EStatus, TStatus } from '@/types/common'
import { TCustomComment } from '@/types/editor-types'
import { TGetEpisodeResponse } from '@/types/episode-type'

export type TMetadata = {
	beatsheet: string
	chapter_title?: string
	context: string
	logline?: string
	loglines: string
	summary: string
}

export type TGetMetadataAPIResponse = {
	data: Record<string, Record<TStatus, TMetadata>>
}

export type TGetMetadataResponse = {
	data: Record<string, TMetadata>
}

export type TMetadataUrlParams = {
	endSequence: number
	projectId: number
	startSequence: number
}

export type TLanguageQueryParams = {
	input_language?: ELanguage
}

export type TPushToGDriveBody = {
	chapter_id: number
	file_name: string
	html_content: string
}

export type TPushToGDriveUrlParams = {
	projectId: string
}

export type TGDriveAuthUrlParams = {
	userId: string
}
export type TGDriveAuthResponse = {
	auth_url: string
}

export type TGetSavingParamsRet = {
	allComments: TDiscussion[]
	chapterData?: TGetEpisodeResponse
	chapterId: number
	commentsStr: string
	contentStr: string
	language: ELanguage
	status: EStatus | 'BASE'
	text: string
	title: string
	word_count: number
}

export type TSaveEpisodeMutationArgs = {
	chapterId?: number | null
	chapter_title?: string
	comments?: TDiscussion[]
	language?: ELanguage
	prevProps?: Record<string, unknown>
	resolvedComments?: TCustomComment[]
	status: EStatus | typeof BASE_STATUS
	text: string
	word_count?: number
}

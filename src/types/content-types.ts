import { ELanguage, TStatus } from '@/types/common'

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

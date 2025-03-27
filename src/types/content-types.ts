import { TStatus } from '@/types/common'

export type TMetadata = {
	beatsheet: string
	chapter_title?: string
	context: string
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

export type TPushToGDriveBody = {
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

export type TMetadata = {
	beatsheet: string
	chapter_title?: string
	context: string
	loglines: string
	summary: string
}

export type TGetMetadataResponse = {
	data: Record<string, TMetadata>
}

export type TMetadataUrlParams = {
	endSequence: number
	projectId: number
	startSequence: number
}

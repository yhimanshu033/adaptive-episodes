import { EStatus } from './common'

export interface EpisodeType {
	id: string
	status: string | null
	title: string
	updatedAt: number
	wordCount: number
	writer: string
}

export interface EpisodeResponse {
	currentPage: number
	episodes: EpisodeType[]
	error: string | null
	hasNext: boolean
	status: number
	totalEpisodes: number
	totalPages: number
}

export interface LoglinesResponse {
	error: string | null
	metadata: {
		beatsheets: string
		loglines: string
	}[]
	previousEpisodeContext: string
	status: number
}

export interface EpisodeDocType {
	activeVersion: number
	activeVersionId: string
	episodeNumber: number
	title: {
		de: string
		us: string
	}
}

export interface VersionDocType {
	beatsheets: string | null
	content: {
		de: string
		us: string
	}
	context: string | null
	createdAt: string
	loglines: string | null
	scenes: string | null
	status: string | null
	summaries: {
		de: string | null
		us: string | null
	}
	updatedAt: number
	versionName: string
	versionNumber: number
	wordCount: number
	writer: string
}

export type TEpisode = {
	chapter_title: string
	comments: string | null
	context: string | null
	create_time: string
	file_url: string
	id: number
	latest_version: number
	parent: number | null
	project: number
	props: Record<string, unknown>
	seq_number: number
	status: EStatus
	translation_url: string | null
	update_time: string
	word_count: number
}

export type TEpisodesData = {
	data: TEpisode[]
	message: string
}

export type TGetEpisodesResponse = {
	count: number
	next: string | null
	previous: number | null
	results: TEpisodesData
}

export type TGetEpisodesQueryParams = {
	page?: number
	project_id: number
	search?: string
}

export type TGetEpisodeResponse = {
	chapter: TEpisode
	next_latest_chapter_id: number | null
	previous_latest_chapter_id: number | null
	text: string
	translation_text: string
}

export type TGetEpisodeUrlParams = {
	chapterId: number
}

export type TPatchEpisodeBody = {
	text: string
} & Partial<TEpisode>

export type TPatchEpisodeUrlParams = {
	episodeId: number
	projectId: number
}

export type TGetEpisodeDetailsQueryParams = {
	parent: number
	project_id: number
}

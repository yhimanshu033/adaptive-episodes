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
	create_time: string
	file_url: string
	id: number
	latest_version: number
	project: number
	props: Record<string, unknown>
	seq_number: number
	status: EStatus
	update_time: string
	word_count: number
}

export type TEpisodesData = {
	data: TEpisode[]
	message: string
}

export type TGetEpisodesResponse = {
	count: number
	next: number | null
	previous: number | null
	results: TEpisodesData
}

export type TGeEpisodesQueryParams = {
	page?: number
	project_id: number
	title?: string
}

export type TGetEpisodeResponse = {
	chapter: TEpisode
	text: string
}

export type TGetEpisodeUrlParams = {
	chapterId: number
}

export type TPatchEpisodeBody = {
	seq: number
	text: string
} & Partial<TEpisode>

export type TPatchEpisodeUrlParams = {
	projectId: number
	title: string
}

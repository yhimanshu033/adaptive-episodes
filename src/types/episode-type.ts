import { TComment } from '@udecode/plate-comments'

import { BASE_STATUS, EStatus } from './common'

type TEpisodeProps = {
	beatsheet: string
	context: string
	loglines: string
	summary: string
}

export type TEpisode = {
	chapter_title: string
	comments: string | null
	context: string | null
	create_time: string
	episodes?: TEpisode[]
	file_url: string
	id: number
	latest_version: number
	parent: number | null
	project: number
	props: Record<string, unknown> & {
		comments?: TComment[]
		llm_memories?: TEpisodeProps
	}
	seq_number: number
	status: EStatus | typeof BASE_STATUS
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
	next_parent_id: number | null
	previous_parent_id: number | null
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

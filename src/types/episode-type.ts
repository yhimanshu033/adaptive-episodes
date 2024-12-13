import { EpisodeActions } from '@/constants/episodes-constants'
import { TComment } from '@udecode/plate-comments'

import { BASE_STATUS, EStatus } from './common'

export type EpisodeStoreState = {
	alertInfo: {
		action?: EpisodeActions
		description: string
	} | null
	currentInventIndex: number | null
	currentPage: number
	deleteEpisodeId: number | null
	episodeSearch: string
	isDialogOpen: boolean
	isInventOpen: boolean
	selectedEpisodes: {
		episodes: TEpisode[]
		status: EStatus | typeof BASE_STATUS
	} | null
}

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
	file_url: string
	id: number
	latest_version: number
	parent: number | null
	project: number
	props?: Record<string, unknown> & {
		comments?: TComment[]
		llm_memories?: TEpisodeProps
		merged_chapter_ids?: number[]
		original_chapters?: TEpisode[]
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

export type TEpisodeInventForm = {
	title: string
}
export type TEpisodeSearchForm = {
	input: string
}

export type TEpisodeMergeParams = {
	chapter_ids: number[]
	project_id: number
	status: string
}

export type TEpisodeUnmergeParams = {
	merged_chapter_id: number
}

export type TEpisodeUnmergeResponse = {
	merged_chapter_id: number
	restored_chapter_ids: number[]
	status: string
}

export type TEpisodeInventParams = {
	chapter_title: string
	content: string
	project_id: number
	seq_number: number
}

export type TEpisodeInventResponse = {
	chapter_title: string
	id: number
	project_id: number
	seq_number: number
	status: string
}

export type TEpisodeDeleteURLParams = {
	chapter_id: number
}

export type TEpisodeDeleteResponse = {
	deleted_chapter_id: number
	message: string
	project_id: number
}

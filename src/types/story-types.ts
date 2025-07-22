import { EImportStatus } from '@/constants/story-constants'

import { ELanguage } from '@/types/common'

export type TStoryStoreState = {
	isFormOpen: boolean
}

export type TGetStoriesResponse = {
	count: number
	next: string | null
	previous: number | null
	results: {
		data: Array<TStory>
		message: string
	}
}

export type TStory = {
	adapting_seq_nos?: number[]
	author: string | null
	base_script_drive_folder_url: string | null
	cms_ready_drive_folder_url: string | null
	create_time: string
	episode_count: number
	id: number
	image: string
	is_original: boolean
	parent_language?: ELanguage
	project_title: string
	props: Record<string, unknown>
	source_language?: ELanguage
	status: EImportStatus
	update_time: string
	user: number | null
}

export type StoryUploadParams = {
	task_data: {
		author: string | null
		end_ep: number
		image: string | null
		input_language: string
		llm_model: string
		project_url: string | null
		run_adaptation: boolean
		start_ep: number
		target_language?: string
		title: string
	}
}

export type TGetStoriesQueryParams = {
	limit?: number
	page?: number
	search?: string
}

export type TGetStoriesQueryParamsKey = keyof TGetStoriesQueryParams

export type TGetStoryDataResponse = {
	data?: TStory
	message: string
}

export type TGetStoryDataUrlParams = {
	storyId: number
}

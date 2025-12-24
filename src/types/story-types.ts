import { EImportStatus } from '@/constants/story-constants'

import { ELanguage } from '@/types/common'

export type TStoryStoreState = {
	isFormOpen: boolean
	setFormOpen: (isOpen: boolean) => void
	setShowTitle: (show: boolean) => void
	setTitle: (title: string) => void
	showTitle: boolean
	title: string
}

export type TGetStoriesResponse = {
	count: number
	next: string | null
	previous: number | null
	results: {
		data: Array<TStory>
		message: string
		recent_size?: number
	}
}

export type TStoryProps = {
	bulk_prompt_history?: string[]
	cms_show_id?: string
	from_scratch?: boolean
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
	languages: ELanguage[]
	parent_language?: ELanguage
	project_title: string
	props?: TStoryProps
	source_language?: ELanguage
	status: EImportStatus
	update_time: string
	user: number | null
}

export type StoryUploadParams = {
	task_data: {
		author: string | null
		book_name?: string
		create_blank_project?: boolean
		end_ep: number
		from_scratch?: boolean
		image: string | null
		input_language: string
		llm_model: string
		project_urls: string[] | null
		run_adaptation: boolean
		run_nwm?: boolean
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

export type TUploadStoryResponse = {
	message: string
	project_id?: number
}

export type TCMSShowUsers = {
	badge_url?: string
	bio?: string
	entity_id: string
	entity_type: string
	image_url?: string
	number_of_shows: string
	role: string
	subscriber_count: string
	title: string
	total_plays: string
}

export type TCMSShow = {
	creator_name: string
	days_since_upload: string
	duration: number
	entity_id: string
	entity_type: string
	image_url?: string
	paid: number | null
	plays: number
	popularity_score: number
	score: number
	title: string
	topics: string[] | null
}

export type TCMSShowMetadata = {
	has_stories: boolean
	story_count: number
	top_story: {
		creator_name: string
		days_since_upload: string
		duration: number
		entity_id: string
		entity_type: string
		image_url: string
		paid: number | null
		plays: number
		popularity_score: number
		score: number
		title: string
		topics: string[] | null
	}
}

export type TGetCMSShowsAPIResponse = {
	message: string
	result: {
		message: string
		metadata: TCMSShowMetadata
		show_module_position: number
		status: number
		stories: TCMSShow[]
		total_stories: number
		total_users: number
		users: TCMSShowUsers[]
	}
	status: number
}

export type TGetCMSShowsQueryParams = {
	is_novel?: 0 | 1
	query: string
}

export type TCMSShowUploadBody = {
	author?: string
	image?: string
	llm_model?: string
	show_id: string
}

export type TCMSUploadFailedResponse = {
	error: string
	existing_project_id: number
	existing_project_title: string
}

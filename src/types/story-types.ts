import { EImportStatus } from '@/constants/story-constants'

export type TStoryStoreState = {
	isFormOpen: boolean
}

export type TGetStoriesResponse = Array<TStory>

export type TStory = {
	author: string | null
	cms_ready_drive_folder_url: string | null
	create_time: string
	episode_count: number
	id: number
	image: string
	project_title: string
	props: Record<string, unknown>
	status: EImportStatus
	update_time: string
	user: number | null
}

export type StoryUploadParams = {
	task_data: {
		author: string | null
		end_ep: number
		image: string | null
		project_url: string | null
		start_ep: number
		title: string
	}
}

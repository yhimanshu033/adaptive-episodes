export interface StoryType {
	author: string
	episodes_count: number
	id: number
	story_name: string
	thumbnailUrl: string
}

export interface StoryResponse {
	data: StoryType[]
	error: string | null
	status: number
}

export interface StoryDocType {
	author: string
	createdAt: number
	description: string
	episodesCount: number
	genre: string[]
	thumbnailUrl: string
	title: string
}

export type TGetStoriesResponse = Array<TStory>

export type TStory = {
	author: string | null
	create_time: string
	episode_count: number
	id: number
	image: string
	project_title: string
	props: Record<string, unknown>
	update_time: string
	user: number | null
}

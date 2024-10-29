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

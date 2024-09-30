export interface StoryType {
	author: string
	episodes_count: number
	id: number
	story_name: string
}

export interface StoryResponse {
	data: StoryType[]
	error: string | null
	status: number
}

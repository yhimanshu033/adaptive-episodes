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

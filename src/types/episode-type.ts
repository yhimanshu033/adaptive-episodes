export interface EpisodeType {
	author: string
	episode_name: string
	id: number
	last_updated: string
	status: string
	wordcount: number
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
	context: string
	error: string | null
	metadata: {
		beatsheets: string
		loglines: string
	}[]
	status: number
}

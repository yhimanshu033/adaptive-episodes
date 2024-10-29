export interface EpisodeType {
	id: string
	status: string | null
	title: string
	updatedAt: number
	wordCount: number
	writer: string
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
	error: string | null
	metadata: {
		beatsheets: string
		loglines: string
	}[]
	previousEpisodeContext: string
	status: number
}

export interface EpisodeDocType {
	activeVersion: number
	activeVersionId: string
	episodeNumber: number
	title: {
		de: string
		us: string
	}
}

export interface VersionDocType {
	beatsheets: string | null
	content: {
		de: string
		us: string
	}
	context: string | null
	createdAt: string
	loglines: string | null
	scenes: string | null
	status: string | null
	summaries: {
		de: string | null
		us: string | null
	}
	updatedAt: number
	versionName: string
	versionNumber: number
	wordCount: number
	writer: string
}

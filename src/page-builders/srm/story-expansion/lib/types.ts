export enum EStoryExpansionTab {
	CHAT = 'chat',
	PARAMETERS = 'parameters',
	PROGRESS = 'progress',
	RANGE = 'range',
	REVIEW = 'review',
	START = 'start',
}

export interface TRange {
	end: number
	start: number
}

export interface TMessage {
	content: string
	id: string
	role: 'user' | 'assistant'
	timestamp: Date
}

export interface TConversationSummary {
	content: string
}

export interface TParameter {
	activePlotThreads: string
	experiments: string
	focus: (
		| 'activePlotThreads'
		| 'keyMoments'
		| 'recurringCharacters'
		| 'themes'
		| 'experiments'
	)[]
	keyMoments: string
	recurringCharacters: string
	themes: string
}

export interface TParameterSummary {
	content: string
}

export interface TEpisode {
	id: string
	name: string
	summary: string
}

export interface TArc {
	episodes: TEpisode[]
	id: string
	name: string
}

export interface TPlan {
	arcs: TArc[]
}

export interface TSelectedItem {
	arcId?: string
	episodeId?: string
	type: 'arc' | 'episode' | null
}

export type TEpisodeProgressStatus =
	| 'pending'
	| 'generating'
	| 'completed'
	| 'cancelled'

export interface TEpisodeProgress {
	arcName: string
	episodeId: string
	episodeName: string
	progress: number
	status: TEpisodeProgressStatus // 0-100
}

export enum EStoryExpansionTab {
	CHAT = 'chat',
	PARAMETERS = 'parameters',
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
	character: string
	focus: 'character' | 'plot' | 'world' | null
	plot: string
	world: string
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

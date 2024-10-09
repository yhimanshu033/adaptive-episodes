export interface LaserToolsParams {
	action: string
	context?: string
	nexttext?: string
	prevtext?: string
	text: string
}

export interface LaserToolsApiResponse {
	data: {
		action: string
		nexttext: string
		prevtext: string
		result: string
		text: string
	}
	message: string
}

export interface AIChatBotParams {
	context?: string
	ep_number?: string
	ep_text: string
	highlighted_text?: string
	messages: {
		content: string
		role: 'user' | 'assistant'
	}[]
	query: string
}

export interface AIChatBotApiResponse {
	data: {
		action: string
		response: string
	}
	message: string
}

export interface AIStoreType {
	messages: {
		content: string
		role: 'user' | 'assistant'
	}[]
}

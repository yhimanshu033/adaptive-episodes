export interface LaserToolsParams {
	action: string
	context?: string
	ep_number: string
	ep_text: string
	nexttext?: string
	prevtext?: string
	prompt?: string
	style_template?: string
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
	beatsheets_array?: string[]
	context?: string
	ep_number?: string
	ep_text?: string
	highlighted_text?: string
	loglines_array?: string[]
	messages: {
		content: string
		role: 'user' | 'assistant'
	}[]
	query: string
	scenes_array?: string[]
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

export interface PlotExplorerParams {
	action: string
	beatsheet_array?: Array<string>
	context?: string
	current_ep?: string
	ep_from: number
	ep_number: string
	ep_to: number
	instruction?: string
	logline_array?: Array<string>
	mode: string
	scene_array?: Array<string>
}

export interface ExplorerType {
	content: string
	title: string
}

export interface PlotExplorerApiResponse {
	data: ExplorerType[]
	message: string
}

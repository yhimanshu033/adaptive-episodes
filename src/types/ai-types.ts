import { Value } from '@udecode/plate-common'

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
	aiChatbotData: {
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
		scenes_array?: string[]
		user_message: string
	}
	episodeNumber: number
	episodesCount: number
}

export interface AIStoreType {
	acceptedValue: Value | null
	messages: {
		content: string
		role: 'user' | 'assistant'
	}[]
	prevValue: Value | null
	responseValue: Value | null
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
	content: string | ExplorerType[]
	title: string
}

export interface PlotExplorerApiResponse {
	data: ExplorerType[]
	message: string
}

export interface TAiChatbotResponse {
	data: {
		action: string
		response: string
	}
	message: string
}

export type TLocalizeObject = {
	localized_name: string
	reason: string
}

export type TLocalizeArrayItem = TLocalizeObject & { name: string }

export type LocalizeRecord = Record<string, TLocalizeObject>

export interface TLocalizeResponse {
	result: {
		characters: LocalizeRecord
		concepts: LocalizeRecord
		places: LocalizeRecord
	}
	task_id: string
}

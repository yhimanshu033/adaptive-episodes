import {
	CharacterAction,
	ExplorerMode,
	ExplorerModeId,
	PlotAction,
	WorldAction,
} from '@/constants/story-explorer-constants'
import { Value } from '@udecode/plate-common'

import { MinifiedValue } from './common'

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
		chat_mode?: EChatMode
		context?: string
		ep_number?: string
		ep_text?: string
		ep_text_json?: MinifiedValue
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

export interface AIChatBotApiResponse {
	data: {
		action: string
		response: string
	}
	message: string
}

export enum EMessenger {
	ASSISTANT = 'assistant',
	USER = 'user',
}
export enum EAction {
	ACCEPT = 'accept',
	ADD = 'add',
	BLOCK = 'block',
	CHANGES = 'changes',
	MESSAGE = 'message',
	REJECT = 'reject',
	REVIEW = 'review',
}

export enum EChatMode {
	BLOCK = 'block',
	LOCALIZE = 'localize',
	PROMPTS = 'prompts',
	REVIEW = 'review',
	SFX = 'sfx',
	VOICE = 'voice',
}

export type TStoryChatSuggestion = {
	action: EChatMode
	value: string
}

export type TMessage =
	| {
			content: string
			role: EMessenger.USER
	  }
	| {
			action: EAction
			content: string
			role: EMessenger.ASSISTANT
			taskId: string
	  }
export interface AIStoreType {
	acceptedValue: Value | null
	activeExplorerActions: {
		[ExplorerModeId.Plot]: PlotAction | string | null
		[ExplorerModeId.Character]: CharacterAction | string | null
		[ExplorerModeId.World]: WorldAction | string | null
	}
	activeExplorerMode: ExplorerModeId
	messages: TMessage[]
	prevValue: Value | null
	requestedAction: EChatMode | null
	responseValue: Value | null
}

export interface PlotExplorerParams {
	action: string
	beatsheet_array: Array<string>
	context: string
	current_ep?: string
	ep_from: number
	ep_number: string
	ep_to: number
	instruction?: string
	loglines_array: Array<string>
	mode: string
	scene_array?: Array<string>
}

export interface ExplorerType {
	content: string | ExplorerType[]
	preContent?: string
	title: string
}

export type ExplorerActionType = PlotAction | CharacterAction | WorldAction

export type ExplorerCategories = Array<{
	action: Array<ExplorerActionType>
	id: ExplorerModeId
	mode: ExplorerMode
}>

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

export type TLocalizeCharacterObject = {
	localized_name: string
	reason?: string
}

export type TLocalizePlaceObject = {
	localized_place: string
	reason?: string
}

export type TLocalizeObjectObject = {
	localized_object: string
	reason?: string
}

export type TLocalizeConceptObject = {
	localized_concept: string
	reason?: string
}

export type TLocalizeCharacterArrayItem = TLocalizeCharacterObject & {
	name: string
}
export type TLocalizePlaceArrayItem = TLocalizePlaceObject & { name: string }
export type TLocalizeConceptArrayItem = TLocalizeConceptObject & {
	name: string
}

export type TLocalizeObjectArrayItem = TLocalizeObjectObject & {
	name: string
}

export type LocalizeCharacterRecord = Record<string, TLocalizeCharacterObject>
export type LocalizePlaceRecord = Record<string, TLocalizePlaceObject>
export type LocalizeConceptRecord = Record<string, TLocalizeConceptObject>
export type LocalizeObjectRecord = Record<string, TLocalizeObjectObject>

export interface TLocalizeResponse {
	result: {
		characters?: LocalizeCharacterRecord
		concepts?: LocalizeConceptRecord
		objects?: LocalizeObjectRecord
		places?: LocalizePlaceRecord
	}
	task_id: string
}

export interface TLocalizeUpdateRequest {
	ls_mapping: Record<string, { localized_name: string; type: string }>
}

export type Laser = {
	clientY?: number
	response: string
	text: string
}

export interface CommentExampleParams {
	comment: string
	commented_text?: string
	context?: string
	ep_text?: string
	next_paragraphs?: string
	prev_paragraphs?: string
}

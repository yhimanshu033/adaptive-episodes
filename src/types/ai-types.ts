import {
	CharacterAction,
	ExplorerMode,
	ExplorerModeId,
	PlotAction,
	WorldAction,
} from '@/constants/story-explorer-constants'
import { Value } from '@udecode/plate-common'

import { ELanguage, LSMappingOutput, MinifiedValue } from '@/types/common'

export interface LaserToolsParams {
	action: string
	context?: string
	ep_number: string
	ep_text: string
	input_language?: string
	last_answer?: string
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
		input_language?: string
		loglines_array?: string[]
		messages: {
			content: string
			role: 'user' | 'assistant'
		}[]
		project_id?: number
		scenes_array?: string[]
		sources?: string[]
		user_message: string
	}
}
export interface AIChatbotHookParams {
	episodeNumber: number
	episodesCount: number
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
	VOICE = 'voice_pass',
	VOICE2 = 'voice_pass_2',
	VOICE2_XML = 'voice_2_xml',
}

export enum EChatMode {
	BLOCK = 'block',
	LOCALIZE = 'localize',
	PROMPTS = 'prompts',
	REVIEW = 'review',
	SFX = 'sfx',
	VOICE = 'voice',
	VOICE2 = 'voice_2',
	VOICE2_XML = 'voice_2_xml',
}

export type TStoryChatSuggestion = {
	action: EChatMode
	value: string
}

export type TUserMessage = {
	content: string
	role: EMessenger.USER
}
export type TAssistantMessage = {
	action: EAction
	component?: React.ReactNode | null
	content: string
	role: EMessenger.ASSISTANT
	taskId: string
}
export type TMessage = TUserMessage | TAssistantMessage

export type StoryExplorerConfiguration = {
	current_ep: boolean
	next_eps: boolean
	prev_eps: boolean
}
export interface AIStoreType {
	acceptedValue: Value | null
	activeCommentExampleMap: Record<string, string>
	activeExplorerActions: {
		[ExplorerModeId.Plot]: PlotAction | string | null
		[ExplorerModeId.Character]: CharacterAction | string | null
		[ExplorerModeId.World]: WorldAction | string | null
	}
	activeExplorerMode: ExplorerModeId
	explorerFocusConfig: EFocusSetting
	inputFocus: string | null
	messages: TMessage[]
	prevValue: Value | null
	requestedAction: EChatMode | null
	responseValue: Value | null
	storyExplorerConfiguration: StoryExplorerConfiguration
}

export interface PlotExplorerParams {
	action: string
	beatsheet_array: Array<string>
	context: string
	current_ep?: string
	ep_from: number
	ep_number: string
	ep_to: number
	input_language?: string
	loglines_array: Array<string>
	mode: string
	project_id: number
	scene_array?: Array<string>
	search_query?: string
}

export interface PlotExplorerQueryResponse {
	content: PlotExplorerApiResponse['data']
	taskId: string
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

export enum EFocusSetting {
	BASE_SCRIPT = 'base_script',
	CMS = 'cms',
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
export type TLocalizeArrayItem =
	| TLocalizeCharacterArrayItem
	| TLocalizeConceptArrayItem
	| TLocalizePlaceArrayItem
	| TLocalizeObjectArrayItem

export interface TLocalizeUpdateRequest {
	ls_mapping: Record<
		string,
		{ description: string; localized_name: string; type: string }
	>
}

export type Laser = {
	clientX?: number
	clientY?: number
	response: string
	text: string
	width?: number
}

export interface CommentExampleParams {
	comment: string
	context?: string
	highlighted_text?: string
	input_language?: string
	next_paragraphs?: string
	prev_paragraphs?: string
}

export interface TVideoTranslationResponse {
	translation: string
}

export interface TVideoTranslationBody {
	video_url: string
}

export type TElevenLabsAPIBody = {
	text: string
}

export type TTSAPIBody = {
	ep_text: string
}

export type TLocalizeBody = {
	input_language?: ELanguage
	project_id: string
	text: string
}

export type TSendAdaptationStartBody = {
	author: string
	inputls: LSMappingOutput | Record<string, never>
	is_external: boolean
	project_id: number
	seq_no: number[]
	source_lang: ELanguage
	target_lang: ELanguage
	type: 'ls_sheet_gen' | 'adaptation'
}

export type TGetAdaptationLSUrlParams = {
	language: ELanguage
	projectId: string
}

export type TQuickPrompt = { text: string; title: string | null }

export type TGetRegexFAR = {
	caseSensitive: boolean | undefined
	genitive: boolean | undefined
	search: string
	wholeWord: boolean | undefined
}

import { TStoryIdeaData } from '@/page-builders/episodes/outliner-questionnaire/lib/types'

import {
	TAssistantMessage,
	TSimplifiedMessage,
	TUserMessage,
} from '@/types/ai-types'
import { ELanguage } from '@/types/common'

export enum EOutlinerTab {
	GENERATE = 'generate',
	VIEW = 'view',
}

export enum EOutlinerChatMode {
	CHAT = 'chat',
	EXPAND_OUTLINE = 'expand-outline',
	GENERATE_CONTENT = 'generate-content',
	GENERATE_SELECTION = 'generate-selection',
}
export type TOutlinerItemData = {
	id: string
	isEditable?: boolean
	multiSelectOptions?: TOutlinerChatStreamedNewIdea[]
	multiSelectSelectedOption?: number
	scenes?: TOutlinerScene[]
	summary: string
	title: string
}

export type TOutlinerData = Array<TOutlinerItemData>

export type TOutlinerTabData = {
	beatIdx?: number
	sceneIdx?: number
	summaryIdx?: number
}

export type TOutlinerChatMessage =
	| (TUserMessage & { context: TOutlinerTabData })
	| TAssistantMessage

export enum EOutlinerHighlightedMode {
	CURRENT_EP_SUMMARY = 'current_episode_summary',
	NARRATIVE_ARCS_PLAN = 'narrative_arc_plan',
}

export enum EOutlinerChatAction {
	CHAT = 'chat_mode',
	GENERATE_NARRATIVE_ARCS_PLAN = 'generate_narrative_arc_plan',
	GENERATE_NEW_IDEAS = 'generate_new_ideas',
	HIGHLIGHT = 'highlighted_mode',
}

export enum EOutlinerMode {
	PGC = 'PGC',
	UGC = 'UGC',
}

export interface TOutlinerChatbotRequestBody {
	action?: string
	chapter_id: number
	chat_history: TSimplifiedMessage[]
	current_episode_context: string
	current_episode_summary: string
	ep_number: number
	ep_text: string
	highlighted_mode?: EOutlinerHighlightedMode
	input_language: ELanguage
	mode: EOutlinerMode
	narrative_arc_plan: string
	previous_episode_context: string
	previous_episode_summary: string
	project_id: number
	scenes: TOutlinerScene[]
	selected_story_idea?: TStoryIdeaData
	user_prompt: string
}

export type TOutlinerChatStreamedResponseItem = {
	action: EOutlinerChatAction
	body?: string
	message: string
}

export type TOutlinerChatStreamedNewIdea = {
	summary: string
	title: string
}

export type TGetOutlinerMetadataResponse = {
	result: {
		current_episode_summary?: string
		narrative_arc_plan?: string
		nwm_running?: boolean
		previous_episode_context?: string
		previous_episode_summary?: string
		summary_match?: boolean
	}
}

export type TGetOutlinerMetadataQueryParams = {
	seq_number: number
}

export type TGetOutlinerMetadataUrlParams = {
	chapterId: number
	projectId: number
}

export type TUpdateOutlinerUrlParams = {
	projectId: number
}

export type TUpdateOutlinerMetadataBody = {
	narrative_arc_plan: string
}

export type TGenerateEpisodeFromSummaryResponse = {
	generated_text: string
}

export type TGenerateEpisodeFromSummaryBody = {
	characters?: string[]
	context?: string
	ep_text?: string
	episode_summary: string
	input_language?: string
	narrative_arc_plan?: string
	prev_episode_summary?: string
	selected_story_idea?: TStoryIdeaData
}

export type TOutlinerChatGetNewIdeasResponse = {
	result: {
		new_episode_ideas: TOutlinerChatStreamedNewIdea[]
	}
}

export type TOutlinerChatGetNewIdeasUrlParams = {
	episodeId: number
}

export type TOutlinerFetchedData = {
	current_episode_summary?: string
	existingNewIdeas?: TOutlinerChatStreamedNewIdea[]
	narrative_arc_plan?: string
	previous_episode_context?: string
	previous_episode_summary?: string
	scenesResponse: TGetOutlinerScenesMetadataAPIResponse | null
	summary_match?: boolean
}

export type TOutlinerChatUpdateNewIdeasBody = {
	new_episode_ideas: TOutlinerChatStreamedNewIdea[]
}

export type TOutlinerSummaryOutlineBody = {
	chapter_id: number
	context?: string
	episode_number: number
	input_language?: ELanguage
	narrative_arc_plan?: string
	project_id: number
	selected_story_idea?: TStoryIdeaData
	summary?: string
}

export type TOutlinerMRU = {
	character: string
	dramatic_function: string
	hidden_motivation: string
	motivation: string
	mru_number: number
	plot_impact: string
	reaction: string
	stated_motivation: string
	subtext: string
	theme_connection: string
}

export type TOutlinerBeat = {
	beat_number: number
	description: string
	function: string
	mrus: TOutlinerMRU[]
	type: 'Setup' | 'Conflict' | 'Revelation' | 'Turning Point' | 'Resolution'
}

export type TOutlinerScene = {
	beats: TOutlinerBeat[]
	cliff: string
	location: string
	scene_number: number
	setup: string
	summary: string
	turns: string
}

export type TOutlinerSceneEditable = Exclude<
	keyof TOutlinerScene,
	'scene_number' | 'beats'
>

export type TOutlinerBeatEditable = Exclude<
	keyof TOutlinerBeat,
	'beat_number' | 'mrus' | 'type'
>

export type TOutlinerEpisodeOutline = {
	scenes: TOutlinerScene[]
}

export type TGetOutlinerScenesMetadataAPIResponse = {
	message: string
	result: TOutlinerScene[]
	status: number
}

export type TGetOutlinerScenesMetadataQueryParams = {
	chapter_id: number | null
}

export type TSaveOutlinerCachedScenesQueryParams = {
	chapter_id: number
	project_id: number
}

export type TGenerateEpisodeFromSummaryV2Body = {
	chapter_id: number
	context?: string
	episode_number: number
	input_language?: string
	narrative_arc_plan?: string
	prev_episode_summary?: string
	project_id: number
	scenes: TOutlinerScene[]
	selected_story_idea?: TStoryIdeaData
	summary: string
}

export type TOutlinerChatGetNarrativeArcsResponse = Array<{
	narrative_arc_plan: string
}>

export type TGenerateNarrativeArcPlanChatMessage = {
	content: string
	role: 'user' | 'assistant'
}

export type TGenerateNarrativeArcPlanBody = {
	chat_history: TGenerateNarrativeArcPlanChatMessage[]
	current_episode_summary: string
	ep_number: number
	ep_text: string
	input_language: ELanguage
	narrative_arc_plan: string
	previous_episode_context: string
	previous_episode_summary: string
	project_id: number
	selected_story_idea?: TStoryIdeaData
}

export type TSaveEpisodeSummaryBody = {
	summary: string
}

export type TSaveEpisodeSummaryUrlParams = {
	episodeId: number
}

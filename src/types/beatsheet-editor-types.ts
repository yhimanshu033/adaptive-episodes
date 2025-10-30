import { ELanguage } from './common'

type DragItem = { id: string; sceneId?: string; type: 'scene' | 'beat' }

export interface BeatsheetEditorStoreType {
	activeDragItem: DragItem | null
	characters: TCharacter[]
	enhancementPlan: boolean
	oldScenes: TScene[]
	openPromptId: string | null
	openSceneIds: string[]
	scenes: TScene[]
}

export type TCharacter = {
	appearance: string
	bio: string
	id: string
	name: string
	recent_arc: string
	voice: string
}

export interface TBeat {
	content: string | null
	id: string
}

export interface TScene {
	beats: TBeat[]
	description?: string
	id: string
	title: string
}

export enum EBeatSheetEditorTabs {
	CHARACTERS = 'characters',
	SCENES = 'scenes',
	STYLE = 'style',
}

export type TGenerateBeatsheetBody = {
	beats: Record<string, TBeat[]>
	beats_old: Record<string, TBeat[]>
	characters?: TCharacter[]
	context?: string
	ep_text: string
	episode_number: number
	input_language: ELanguage
	order_change: boolean
	project_id: number
	scene_texts: Record<string, string>
	scene_wide_prompt?: string
	use_enhancement_plan?: boolean
}

export type TGenerateBeatsheetResponse = Array<TGenerateBeatsheetResponseItem>

export type TGenerateBeatsheetResponseItem = {
	content: string
	id: string
}

export type TGetScenesMetadataAPIResponse = {
	message: string
	result: TScene[]
	status: number
}
export type TGetScenesMetadataQueryParams = {
	chapter_id: number | null
}

export type TEpisodeRegenerateParams = {
	chapter_id: number
	ep_text: string
	episode_number?: number
	input_language: ELanguage
	project_id: number
}

export interface TSceneUpdateBody {
	scenes: TSceneUpdateBodyScene[]
}

interface TSceneUpdateBodyScene {
	beats: TSceneUpdateBodyBeat[]
	beats_count: number
	chapter_id: number
	char_count: number
	line_count: number
	location: string
	nwm_scene_id: string
	project_id: number
	scene_id?: string
	scene_number: number
	scene_text: string
	sentence_count: number
	word_count: number
}

interface TSceneUpdateBodyBeat {
	active_characters?: string[]
	active_plot_threads?: string[]
	beat_id: string
	beat_text: string
	beat_type?: string
	text?: string
}

export interface TSceneUpdateResponse {
	error?: string
	message: string
	result?: TSceneUpdateResponseScene[]
	status: number
}

interface TSceneUpdateResponseScene {
	beats: TSceneUpdateResponseBeat[]
	id: string
	title: string
}

interface TSceneUpdateResponseBeat {
	content: string
	id: string
}

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

export type TGenerateBeatsheetResponse = Array<{
	content: string
	id: string
}>

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
	input_language: ELanguage
	project_id: number
}

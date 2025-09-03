import { ELanguage } from './common'

type DragItem = { id: string; sceneId?: string; type: 'scene' | 'beat' }

export interface BeatsheetEditorStoreType {
	activeDragItem: DragItem | null
	characters: TCharacter[]
	enhancementPlan: boolean
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
	content: string
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
	characters?: TCharacter[]
	context?: string
	ep_text: string
	input_language: ELanguage
	scene_texts: Record<string, string>
	use_enhancement_plan?: boolean
}

export type TGenerateBeatsheetResponse = Array<{
	content: string
	id: string
}>

export type TGetScenesMetadataAPIResponse = {
	data: TScene[]
}
export type TGetScenesMetadataQueryParams = {
	chapter_id: number
}

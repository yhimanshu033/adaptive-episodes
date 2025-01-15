import { Value } from '@udecode/plate-common'

import { Laser } from './ai-types'

export enum ESidebar {
	CHATBOT = 'chatbot',
	COMMENTS = 'comments',
	FAR = 'far',
	OUTLINE = 'outline',
	TRANSLATION = 'translation',
}
export type PlateStoreData = {
	activeDiffId: string | null
	currentDiffValue: Value | null
	resolved: boolean
	scale: number
	sidebar: ESidebar | null
	viewMode: boolean
}

export type LaserStoreType = {
	active: string | null
	editorX?: number
	editorY?: number
	lasers: Record<string, Laser>
	promptActive: string | null
	responseActive: string | null
	screenY?: number
	triggerRephrase?: string | null
}

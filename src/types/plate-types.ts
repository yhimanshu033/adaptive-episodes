import { TDescendant, Value } from '@udecode/plate-common'

import { Laser } from '@/types/ai-types'

export type Selection = {
	anchor: {
		offset: number
		path: [number, number]
	}
	focus: {
		offset: number
		path: [number, number]
	}
}

export type Child = {
	id: string
	text: string
}

export type Block = {
	children: Child[]
	type: string
}

export type Node = {
	children: Block[]
}

export type TLaserLeafChildren = {
	props: {
		parent: {
			children: TDescendant[]
		}
	}
}

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

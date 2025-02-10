import { CommentUser } from '@udecode/plate-comments'
import { TDescendant, Value } from '@udecode/plate-common'
import { SuggestionUser } from '@udecode/plate-suggestion'

import { ERole, UserData } from '@/types/admin-types'
import { Laser, PlotExplorerApiResponse } from '@/types/ai-types'

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
	DUAL_VIEW = 'dual-view',
	FAR = 'far',
	OUTLINE = 'outline',
}
export type PlateStoreData = {
	activeDiffId: string | null
	activeNoteId: string | null
	currentDiffValue: Value | null
	fontFamily: string
	localDiffValue: Value | null
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

export type TNote = {
	content: string | PlotExplorerApiResponse['data']
	id: string
	title: string
	updateTime: string
}

export type PlateUser = SuggestionUser &
	CommentUser &
	UserData & { role: ERole }

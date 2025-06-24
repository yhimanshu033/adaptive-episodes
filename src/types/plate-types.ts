import { CommentUser } from '@udecode/plate-comments'
import { TDescendant, Value } from '@udecode/plate-common'
import { SuggestionUser } from '@udecode/plate-suggestion'

import { ERole, UserData } from '@/types/admin-types'
import { ExplorerType, Laser } from '@/types/ai-types'

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
	NOTES = 'notes',
	OUTLINE = 'outline',
}
export type PlateStoreData = {
	activeDiffId: string | null
	currentDiffValue: Value | null
	diffIdList: string[]
	focusMode: boolean
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
	promptPosition?: PromptPosition
	responseActive: string | null
	triggerRephrase?: string | null
}

export type TNote = {
	content?: string | Partial<ExplorerType>
	edit?: string
	episodeNo?: number
	episodeRange?: string
	id: string
	modeAction?: string
	title: string
	updateTime: string
}

export type PlateUser = SuggestionUser &
	CommentUser &
	UserData & { role: ERole }

export type PromptPosition = Pick<Laser, 'clientX' | 'clientY' | 'width'>

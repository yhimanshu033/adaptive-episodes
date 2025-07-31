import { DiffStatus } from '@/constants/ai-constants'
import { DiffProps as LegacyProps } from '@platejs/diff'
import { SuggestionUser } from '@platejs/suggestion'
import { Descendant, Value } from 'platejs'
import { PlatePlugin } from 'platejs/react'

import { TDiscussion } from '@/components/editor/plugins/discussion-kit'

import { ExplorerType, Laser } from '@/types/ai-types'

import { ERole } from './admin-types'

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
			children: Descendant[]
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

export type AuthenticatedUser = {
	create_time: string
	email: string
	firebase_registration_token: string | null
	firstname: string | null
	fullname: string
	google_drive_token: string | null
	is_verified: boolean
	lastname: string | null
	login_type: string | null
	phone_number: string | null
	role: ERole
	team: string
	uid: string
	update_time: string
	username: string | null
}

export type PlateUser = SuggestionUser & Partial<AuthenticatedUser>

export type PromptPosition = Pick<
	Laser,
	'clientX' | 'clientY' | 'width' | 'height'
>

export type TOldComment = {
	createdAt: number
	id: string
	parentId?: string
	userId: string
	value: Value
}

export type TCommentGeneric = TDiscussion | TOldComment

export interface DiffViewProps {
	className?: string
	current?: Value | null
	plugins?: PlatePlugin[]
	previous?: Value | null
	readonly?: boolean
}
export interface DiffProps extends LegacyProps {
	diff_id: string
	status: DiffStatus
}

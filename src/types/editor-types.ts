import { Dispatch, SetStateAction } from 'react'
import { storyChatSuggestions, zoomToWidth } from '@/constants/editor-constants'
import { colorOptions } from '@/constants/global-constants'
import { TSuggestionDescription } from '@platejs/suggestion'
import { TCommentText, Value } from 'platejs'

import { TComment } from '@/components/plate-ui-v2/comment'

import {
	TLocalizeCharacterArrayItem,
	TLocalizeConceptArrayItem,
	TLocalizeObjectArrayItem,
	TLocalizePlaceArrayItem,
	TQuickPrompt,
} from '@/types/ai-types'
import { TGetEpisodeResponse } from '@/types/episode-type'
import { ESidebar } from '@/types/plate-types'

export type TCustomComment = TComment & { node: TCommentText }

export interface RephraseSelectionProps {
	additionalContext?: boolean
	elemKey: string | null
	getSelectedText: () => {
		nexttext: string
		prevtext: string
		text: string
	}
	methodId: string
	onResetLeaf: () => void
	promptInput: string
	setResponseMode: Dispatch<SetStateAction<boolean>>
}

export interface IndexedCommentsResponse {
	comment: string
	id: string
	path: {
		end: number
		start: number
	}
}

export interface ReviewComment {
	id: string
	nodeId: string
	nodeText: string
	text: string
}

export interface IndexedSFXResponseItem {
	id: string
	match_string?: string
	sfx?: string
}

export type IndexedSFXResponse = Array<IndexedSFXResponseItem>

export interface IndexedVoicePassResponseItem {
	id: string
	match_string: string
	rewrite: string
}

export type IndexedVoicePassResponse = Array<IndexedVoicePassResponseItem>

export type EditorExtendedStore = {
	episodeContentMap: Record<number, { children: Value }>
	episodeKeys: Record<number, (string | number | boolean)[]>
	episodeMap: Record<number, TGetEpisodeResponse>
	episodeNavigationOpen: boolean
	extended: number[]
}

export enum EReviewType {
	COMMENT = 'comment',
	DESCRIPTION = 'description',
}

export type TReview =
	| { data: TCustomComment; type: EReviewType.COMMENT }
	| { data: TSuggestionDescription; type: EReviewType.DESCRIPTION }

export type TColorKey = keyof typeof colorOptions

export type TLocalizationObject = [
	{
		entities: TLocalizeCharacterArrayItem[]
		title: 'Characters'
	},
	{
		entities: TLocalizePlaceArrayItem[]
		title: 'Places'
	},
	{
		entities: TLocalizeConceptArrayItem[]
		title: 'Concepts'
	},
	{
		entities: TLocalizeObjectArrayItem[]
		title: 'Objects'
	},
]
export type TSuggestions = (typeof storyChatSuggestions)[number]

export enum ESuggestionViewingType {
	CORRECTIONS = 'corrections',
	DESIRED = 'desired',
}

export enum EThemeMode {
	DARK = 'dark',
	LIGHT = 'light',
}
export type TStoredConfigurationData = {
	defaultSidebar: ESidebar | null
	quickPrompts: TQuickPrompt[]
	suggestionDisplay: ESuggestionViewingType
	theme: EThemeMode
	zoomLevel: TZoomLevel
}

export type TConfigurationData = {
	configurationDialogOpen: boolean
	configurationDialogTab: EConfigurationDialogContentTab
} & TStoredConfigurationData

export enum EConfigurationContentItemDataType {
	BUTTON = 'button',
	CUSTOM = 'custom',
	DROPDOWN = 'dropdown',
	TOGGLE = 'toggle',
}

export type ConfigurationContentItemData =
	| {
			dropdownItems: { title?: React.ReactNode; value: string }[]
			onSelect: (data: string) => void
			selectedValue: string
			type: EConfigurationContentItemDataType.DROPDOWN
	  }
	| {
			offIcon?: React.ReactNode
			onIcon?: React.ReactNode
			onSelect: (data: boolean) => void
			selectedValue: boolean
			type: EConfigurationContentItemDataType.TOGGLE
	  }
	| {
			buttonText?: React.ReactNode
			onSelect: () => void
			type: EConfigurationContentItemDataType.BUTTON
	  }
	| {
			customHandler: React.ReactNode
			type: EConfigurationContentItemDataType.CUSTOM
	  }
export type TConfigurationContentItem = {
	data: ConfigurationContentItemData
	description: string
	title: string
}

export enum EConfigurationDialogContentTab {
	OPTIONS = 'options',
	QUICK_PROMPTS = 'quick-prompts',
}

export interface TextStats {
	charCount: number
	lineCount: number
	sentenceCount: number
	wordCount: number
}

export type TZoomLevel = keyof typeof zoomToWidth | 'Fit'

import { Dispatch, SetStateAction } from 'react'
import { storyChatSuggestions } from '@/constants/editor-constants'
import { colorOptions } from '@/constants/global-constants'
import { TSuggestionDescription } from '@platejs/suggestion'
import { TCommentText, Value } from 'platejs'

import { TComment } from '@/components/plate-ui-v2/comment'

import {
	TLocalizeCharacterArrayItem,
	TLocalizeConceptArrayItem,
	TLocalizeObjectArrayItem,
	TLocalizePlaceArrayItem,
} from '@/types/ai-types'
import { TGetEpisodeResponse } from '@/types/episode-type'

export type TCustomComment = TComment & { node: TCommentText }

export interface RephraseSelectionProps {
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

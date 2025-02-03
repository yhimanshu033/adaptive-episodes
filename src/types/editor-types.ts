import { Dispatch, SetStateAction } from 'react'
import { TComment, TCommentText } from '@udecode/plate-comments'

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
	text: string
}

export interface IndexedSFXResponseItem {
	id: string
	match_string: string
	sfx: string
}

export type IndexedSFXResponse = Array<IndexedSFXResponseItem>

export type EditorExtendedStore = {
	episodeMap: Record<number, TGetEpisodeResponse>
	extended: number[]
}

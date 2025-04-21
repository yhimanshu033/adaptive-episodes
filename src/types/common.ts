import { ForwardRefExoticComponent, RefAttributes } from 'react'
import { LucideProps } from 'lucide-react'

import { SessionData } from '@/types/admin-types'
import { SaveEpisodeParams } from '@/types/episode-type'

export type LucideComponent = ForwardRefExoticComponent<
	Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>
>

export interface GlobalStoreState {
	isFullScreenLoading: boolean
	unsavedEpisodeParams: Record<string, SaveEpisodeParams>
	userData: SessionData | null
}

export enum EStatus {
	AB_TEST = 'AB_TEST',
	FIRST_DRAFT = '1ST_DRAFT',
	IN_REVIEW = 'IN_REVIEW',
	POLISH = 'POLISH',
	PUBLISHED = 'PUBLISHED',
	REOPENED = 'REOPENED',
	SECOND_DRAFT = '2ND_DRAFT',
}

export enum ELanguage {
	DEUTSCH = 'Deutsch',
	ENGLISH = 'English',
	HINDI = 'Hindi',
	ITALIAN = 'Italian',
	SPANISH = 'Spanish',
}

export type TSourceLanguage = ELanguage.ENGLISH | ELanguage.HINDI

export const BASE_STATUS = 'BASE'

export const STATUS_ORDER = [
	EStatus.PUBLISHED,
	EStatus.POLISH,
	EStatus.SECOND_DRAFT,
	EStatus.FIRST_DRAFT,
	BASE_STATUS,
] as const

export type TStatus = (typeof STATUS_ORDER)[number]

export type TNoParams = Record<string, never>

export type IndexedText = {
	id: string
	text: string
}

export type TOpenedStories = number[]
export type TOpenedStoryPage = {
	limit?: number
	page?: number
	search?: string
	seqNumber?: number
}
export type TOpenedEpisodeList = Record<number, TOpenedStoryPage>

export type MinifiedValue = Array<IndexedText>

export type TSocketQueryParams = { room_id?: string; task_id: string }

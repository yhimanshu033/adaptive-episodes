import React, { ForwardRefExoticComponent, RefAttributes } from 'react'
import { LucideProps } from 'lucide-react'

import { FetchRequestParams, FetchResponseResult } from '@/lib/fetch-api'

import { SessionData } from '@/types/admin-types'
import { SaveEpisodeParams } from '@/types/episode-type'

export type LucideComponent = ForwardRefExoticComponent<
	Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>
>

export type IconComponent = (
	props: React.SVGProps<SVGSVGElement>
) => React.ReactNode

export interface GlobalStoreState {
	fullScreenLoadingMessage: string
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

export enum EEpisodeType {
	ADAPTED = 'ADAPTED',
	INVENTED = 'INVENTED',
	MERGED = 'MERGED',
	ORIGINAL = 'ORIGINAL',
}

export enum ELanguage {
	CHINESE = 'chinese',
	DEUTSCH = 'deutsch',
	ENGLISH = 'english',
	ENGLISH_UK = 'english_uk',
	ENGLISH_US = 'english_us',
	FRENCH = 'french',
	GERMAN = 'german',
	GERMAN_ORIGINAL = 'german_original',
	HINDI = 'hindi',
	ITALIAN = 'italian',
	JAPANESE = 'japanese',
	KANNADA = 'kannada',
	KOREAN = 'korean',
	MALAYALAM = 'malayalam',
	MEXICAN_SPANISH = 'mexican_spanish',
	NEUTRAL_SPANISH = 'neutral_spanish',
	TAMIL = 'tamil',
	TELUGU = 'telugu',
	TRANSLATED_ENGLISH = 'translated_english',
}

export type TSourceLanguage =
	| ELanguage.ENGLISH
	| ELanguage.HINDI
	| ELanguage.CHINESE
	| ELanguage.TRANSLATED_ENGLISH
	| ELanguage.KOREAN
	| ELanguage.DEUTSCH
	| ELanguage.JAPANESE
	| ELanguage.GERMAN

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

export enum ELSMappingType {
	CHARACTER = 'Character',
	ENTITY = 'entity',
	PERSON = 'person',
}

export enum ELSMappingGender {
	FEMALE = 'Female',
	MALE = 'Male',
}

export enum ELSMappingChineseGender {
	FEMALE = 'female',
	MALE = 'male',
	NEUTRAL = 'neutral',
	UNKNOWN = 'unknown',
}

export type LSMappingCommon = {
	gender?: ELSMappingGender | ELSMappingChineseGender
	is_deleted?: string
	type: ELSMappingType
} & Partial<{ [key: string]: string | number }>

export interface LSMappingOutputItem extends LSMappingCommon {
	localised_name: string
	original_name: string
}
export interface LSMappingSequenceData {
	[LSMappingSequenceField]: {
		[key: string]: string[]
	}
}
export interface LSMappingOutputItemV2 {
	[key: string]: LSMappingOutputItem[]
}

export interface LSMappingInputItem {
	[key: string]: {
		localised_name: string
	} & LSMappingCommon
}

export const LSMappingSequenceField = 'sequence_ls'
export type LSMappingInputItemV2 = Record<string, LSMappingInputItem>

export interface LSMappingInput {
	ls_mapping: LSMappingInputItemV2
}

export interface LSMappingOutput {
	ls_mapping: LSMappingOutputItemV2
}

export type StartPollingParams<
	BodyParamsT = TNoParams,
	ResponseDataT = TNoParams,
	UrlParamsT = TNoParams,
	QueryParamsT = TNoParams,
> = FetchRequestParams<ResponseDataT, UrlParamsT, BodyParamsT, QueryParamsT> & {
	delay: number
	stop: (data: FetchResponseResult<ResponseDataT>) => boolean
}

import { EpisodeActions } from '@/constants/episodes-constants'
import { TComment } from '@udecode/plate-comments'

import { BASE_STATUS, EEpisodeType, ELanguage, EStatus } from '@/types/common'
import { TCustomComment } from '@/types/editor-types'
import { TNote } from '@/types/plate-types'

export type EpisodeStoreState = {
	alertInfo: {
		action?: EpisodeActions
		description: string
	} | null
	currentInventIndex: number | null
	currentPage: number
	deleteEpisodeId: number | null
	episodeSearch: string
	isDialogOpen: boolean
	isInventOpen: boolean
	notes: TNote[]
	selectedEpisodes: {
		episodes: TEpisode[]
		status: EStatus | typeof BASE_STATUS
	} | null
}

type TEpisodeProps = {
	beatsheet: string
	context: string
	loglines: string
	summary: string
}

export type TEpisode = {
	chapter_title: string
	comments: string | null
	context: string | null
	create_time: string
	file_url: string
	id: number
	is_deleted: boolean
	language?: ELanguage
	latest_version: number
	original_seq_number: number
	parent: number | null
	project: number
	props?: Record<string, unknown> & {
		comments?: TComment[]
		creation_timestamp?: number
		llm_memories?: TEpisodeProps
		merged_chapter_ids?: number[]
		notes?: TNote[]
		original_chapters?: TEpisode[]
	}
	seq_number: number
	status: EStatus | typeof BASE_STATUS
	translation_url: string | null
	type: EEpisodeType
	update_time: string
	word_count: number
	writer?: number
}

export type TEpisodesData = {
	data: TEpisode[]
	message: string
}

export type TGetEpisodesResponse = {
	count: number
	next: string | null
	previous: number | null
	results: TEpisodesData
}

export type TGetEpisodesQueryParams = {
	limit?: number
	page?: number
	project_id: number
	search?: string
}

export type TGetEpisodeResponse = {
	chapter: TEpisode
	next_parent_id: number | null
	previous_parent_id: number | null
	text: string
	translation_text: string
}

export type TGetEpisodeUrlParams = {
	chapterId: number
}

export type TPatchEpisodeBody = {
	text: string
} & Partial<TEpisode>

export type SaveEpisodeParams = {
	episodeId: number
	projectId: number
} & TPatchEpisodeBody

export type TPatchEpisodeUrlParams = {
	episodeId: number
	projectId: number
}

export type TGetEpisodeDetailsQueryParams = {
	parent: number
	project_id: number
}

export type TEpisodeInventForm = {
	title: string
}
export type TEpisodeSearchForm = {
	input: string
}

export type TEpisodeMergeParams = {
	chapter_ids: number[]
	project_id: number
	status: string
}

export type TEpisodeUnmergeParams = {
	merged_chapter_id: number
}

export type TEpisodeUnmergeResponse = {
	merged_chapter_id: number
	restored_chapter_ids: number[]
	status: string
}

export type TEpisodeInventParams = {
	chapter_title: string
	content: string
	language?: ELanguage
	project_id: number
	seq_number: number
}

export type TEpisodeInventResponse = {
	chapter_title: string
	id: number
	project_id: number
	seq_number: number
	status: string
}

export type TEpisodeDeleteURLParams = {
	chapter_id: number
}

export type TEpisodeDeleteResponse = {
	deleted_chapter_id: number
	message: string
	project_id: number
}

export type TStatusUpdateURLParams = {
	parent_id: number
	project_id: number
}

export type TStatusUpdateBody = {
	language?: ELanguage
	status: string
}

export type TStatusUpdateResponse = {
	id: number
	message: string
	parent: number
	project_id: number
	status: string
}

export type TGetDocxFromHtmlBody = {
	html_content: string
}

export type EpisodeIdStoreType = {
	activeNoteId: string | null
	currentTitle: string
	dualViewMode: EDualVIewMode
	episodeId: number
	resolvedComments: TCustomComment[]
	selectedLanguage: ELanguage | undefined
	selectedStatus: EStatus | undefined
	startOverlayLoading: boolean
}

export type TSaveEpisodeParams = {
	forced?: boolean
	startOverlayLoading?: boolean
	stopOverlayLoading?: boolean
}

export type TSavingContext = {
	handleSave: (params?: TSaveEpisodeParams) => Promise<void>
	isPending: boolean
	isSaved: boolean
	lastSaved: Date | undefined
	setForceSave: React.Dispatch<React.SetStateAction<boolean>>
}

export type DownloadDocxParams = { latestStatus: EStatus | 'BASE' | undefined }

export enum EDualVIewMode {
	BASE_SCRIPT = 'BASE SCRIPT',
	LOCAL_DIFF = 'LOCAL_DIFF',
	NEXT_EP = 'NEXT_EP',
	PREV_EP = 'PREVIOUS_EP',
	US_TRANSLATION = 'US_TRANSLATION',
	VOICE_PASS = 'VOICE_PASS',
}

export const DUAL_VIEW_MODES: EDualVIewMode[] = [
	EDualVIewMode.US_TRANSLATION,
	EDualVIewMode.BASE_SCRIPT,
	EDualVIewMode.PREV_EP,
	EDualVIewMode.NEXT_EP,
	EDualVIewMode.VOICE_PASS,
	EDualVIewMode.LOCAL_DIFF,
]

export const MODE_TO_TITLE: Record<EDualVIewMode, string> = {
	[EDualVIewMode.US_TRANSLATION]: 'US Original',
	[EDualVIewMode.BASE_SCRIPT]: 'Base Script',
	[EDualVIewMode.NEXT_EP]: 'Next Episode',
	[EDualVIewMode.LOCAL_DIFF]: 'Local Changes',
	[EDualVIewMode.PREV_EP]: 'Previous Episode',
	[EDualVIewMode.VOICE_PASS]: 'Voice Pass',
}

export type TranslationProps = { translatedContent: string }

export enum EEpisodeHeaderKeys {
	ACTIONS = 'actions',
	CHAPTER_TITLE = 'chapter_title',
	SELECT_COL = 'select-col',
	SERIAL_NUMBER = 'serialNumber',
	STATUS = 'status',
	UPDATE_TIME = 'update_time',
	WORD_COUNT = 'word_count',
	WRITER = 'writer',
}

export const EPISODE_LIMIT_KEY = 'episodeLimit'

export enum ENotesAction {
	CREATE = 'create',
	DELETE = 'delete',
	DELETE_ALL = 'delete_all',
	UPDATE = 'update',
}

export type TGetNotesResponse = {
	data: {
		create_time: string
		notes: Record<
			string,
			{
				create_time: string
				note_text: string
				update_time: string
			}
		>
		project: number
		update_time: string
		user: number
	}
}

export type TNotesUpdateBody = {
	action: ENotesAction
	note_text?: string
	unique_id: string
}

export type TPlayingEpisode = {
	info: {
		chapter?: string
		episode?: string
		img?: string
	}
}

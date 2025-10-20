import { DiffStatus } from '@/constants/ai-constants'
import {
	ACTION,
	EDeviceBrowser,
	EDeviceOS,
	EDeviceType,
	EVENT_TYPE,
	SCREEN_NAME,
} from '@/constants/analytics'

import { EChatMode } from '@/types/ai-types'

export type TEventData = Record<
	string,
	string | number | boolean | undefined | null
>

export type TEventName = EVENT_TYPE
export type TScreenName = SCREEN_NAME
export type TAction = ACTION

export interface TAnalyticsArgs {
	appVersionCode?: string | number
	campaign?: string | null
	currentTimestamp?: number
	deployEnv?: string
	deviceId?: string | null
	event: TEventName
	medium?: string | null
	metaData?: TEventMeta
	platformString?: string
	referrer?: string | null
	resolution?: string
	screenName: TScreenName
	sessionId?: string | null
	uid?: string
}

export interface TAnalyticsPostData {
	common_fields: {
		device_id: string | null
		session_id: string | null
		uid?: string
	}
	events: Array<{ data: TEventMeta; eventId: string }>
	group: string
}

export interface TDeviceDetails {
	browser: EDeviceBrowser
	os: EDeviceOS
	type: EDeviceType
}

export interface TParseDeviceArgs {
	platform?: string
	userAgent?: string
}

export type TConditionalMetadata =
	| { action: ACTION.LASER_START; flowId: string; method: string }
	| { action: ACTION.LASER_CANCEL; flowId: string; method: string }
	| {
			action: ACTION.LASER_RESPONSE_ACCEPT
			flowId?: string
			response: string
			source?: string
	  }
	| {
			action: ACTION.LASER_RESPONSE_REJECT
			flowId?: string
			response: string
			source?: string
	  }
	| {
			action: ACTION.LASER_RESPONSE_RETRY
			flowId?: string
			response: string
			source?: string
	  }
	| { action: ACTION.STORY_CHAT_CANCEL; flowId?: string }
	| {
			action: ACTION.STORY_CHAT_SUGGESTION
			suggestionAction: string
			suggestionValue: string
	  }
	| {
			action: ACTION.STORY_CHAT_PROMPT
			chat_mode?: EChatMode
			flowId: string
			prompt: string
	  }
	| { action: ACTION.SFX_ACCEPT; all: boolean; flowId?: string }
	| { action: ACTION.COMMENT_EXAMPLE; flowId: string }
	| { action: ACTION.COMMENT_EXAMPLE_CANCEL; flowId: string }
	| { action: ACTION.SIDEBAR_CHANGED; sidebarType: string }
	| { action: ACTION.DUAL_VIEW_CHANGED; dualViewType: string }
	| { action: ACTION.STORY_EXPLORER_TAB_CHANGE; tab: string }
	| { action: ACTION.STORY_EXPLORER_ACTION; actionType: string; tab: string }
	| { action: ACTION.STORY_EXPLORER_FOCUS; focusInput: string | null }
	| { action: ACTION.RUN_NWM; chapterId: string }
	| {
			action: ACTION.FIND_REPLACE_SUGGESTION
			suggestion: string
			suggestionReason: string
	  }
	| { action: ACTION.THEME_TOGGLE; theme: string }
	| {
			action: ACTION.ADAPTATION_LS_GEN
			llmModel: string
			sourceLang: string
			targetLang: string
	  }
	| {
			action: ACTION.ADAPTATION_LS_SEND
			llmModel: string
			sourceLang: string
			targetLang: string
	  }
	| { action: ACTION.BASE_SCRIPT_EXTENSION; size: string }
	| { action: ACTION.DOWNLOAD_BULK_EPISODES; separate: string; size: number }
	| {
			action: ACTION.PROMPT_BULK_EPISODES
			flowId: string
			language?: string
			prompt: string
			size: string
	  }
	// new
	| {
			action: ACTION.STORY_CHAT_SFX_ADDED
			flowId: string
			response: string
	  }
	| {
			action: ACTION.STORY_CHAT_REVIEW_ADDED
			flowId: string
			response: string
	  }
	| {
			action: ACTION.VOICE_PASS_ADDED
			flowId: string
			response: string
	  }
	| {
			action: ACTION.STORY_CHAT_SINGLE_SFX_ACTION
			change: DiffStatus
			flowId: string
			sfx: string
	  }
	| { action?: TAction }

export type TEventMeta = TEventData &
	TConditionalMetadata & {
		content_language?: string
		route?: string
		time_since_load_start?: string
	}

export interface THandleEventLogClientArgs {
	event: TEventName
	metaData?: TEventMeta
	screenName: TScreenName
	sendContentLanguage?: boolean
	sendRoute?: boolean
}

export interface THandleClientPageLoadArgs {
	metaData?: TEventMeta
	screenName: TScreenName
}

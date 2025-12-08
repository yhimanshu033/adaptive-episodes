import { DiffStatus } from '@/constants/ai-constants'
import {
	ACTION,
	EDeviceBrowser,
	EDeviceOS,
	EDeviceType,
	EFeedback,
	EVENT_TYPE,
	SCREEN_NAME,
} from '@/constants/analytics'

import { EChatMode } from '@/types/ai-types'

export type TEventExtraData = Record<
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
	events: Array<{ data: TEvent; eventId: string }>
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
			responseWordCount?: number
			source?: string
	  }
	| {
			action: ACTION.LASER_RESPONSE_REJECT
			flowId?: string
			response: string
			responseWordCount?: number
			source?: string
	  }
	| {
			action: ACTION.LASER_RESPONSE_RETRY
			flowId?: string
			response: string
			responseWordCount?: number
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
	| {
			action: ACTION.OUTLINER_CHAT_START
			flowId: string
			mode?: string
			prompt: string
	  }
	| {
			action: ACTION.OUTLINER_CHAT_END
			flowId: string
			mode?: string
			prompt: string
			response: string
	  }
	| {
			action: ACTION.OUTLINER_CHAT_TOGGLE
			beatIdx?: number
			sceneIdx?: number
			summaryIdx?: number
			tab: string
	  }
	| {
			action: ACTION.OUTLINER_ZOOM_IN
			beatIdx?: number
			sceneIdx?: number
			summaryIdx?: number
	  }
	| {
			action: ACTION.OUTLINER_ZOOM_OUT
			beatIdx?: number
			sceneIdx?: number
			summaryIdx?: number
	  }
	| {
			action: ACTION.OUTLINER_NEW_IDEAS_START
			flowId: string
			retry?: boolean
	  }
	| {
			action: ACTION.OUTLINER_NEW_IDEAS_END
			flowId: string
			response: string
			retry?: boolean
	  }
	| {
			action: ACTION.OUTLINER_NEW_IDEAS_ACCEPT
			flowId: string
			optionIdx: number
			summary: string
			summaryIdx: number
	  }
	| {
			action: ACTION.OUTLINER_NEW_IDEAS_REJECT
			flowId: string
			optionIdx: number
			summary: string
			summaryIdx: number
	  }
	| {
			action: ACTION.OUTLINER_NARRATIVE_ARCS_START
			flowId: string
			retry?: boolean
	  }
	| {
			action: ACTION.OUTLINER_NARRATIVE_ARCS_END
			flowId: string
			response: string
			retry?: boolean
	  }
	| {
			action: ACTION.OUTLINER_NARRATIVE_ARCS_ACCEPT
			flowId: string
			optionIdx: number
			summary: string
			summaryIdx: number
	  }
	| {
			action: ACTION.OUTLINER_NARRATIVE_ARCS_REJECT
			flowId: string
			optionIdx: number
			summary: string
			summaryIdx: number
	  }
	| {
			action: ACTION.OUTLINER_GENERATE_OUTLINE_START
			flowId: string
			summary: string
	  }
	| {
			action: ACTION.OUTLINER_GENERATE_OUTLINE_END
			flowId: string
			response: string
			summary: string
	  }
	| {
			action: ACTION.OUTLINER_GENERATE_CONTENT_START
			flowId: string
	  }
	| {
			action: ACTION.OUTLINER_GENERATE_CONTENT_END
			flowId: string
			response: string
	  }
	| {
			action: ACTION.OUTLINER_CHAT_USER_FEEDBACK
			comment?: string
			feedback: EFeedback
			flowId: string
	  }
	| {
			action: ACTION.OUTLINER_NEW_IDEAS_USER_FEEDBACK
			comment?: string
			feedback: EFeedback
			flowId: string
	  }
	| {
			action: ACTION.OUTLINER_NARRATIVE_ARCS_USER_FEEDBACK
			comment?: string
			feedback: EFeedback
			flowId: string
	  }
	| {
			action: ACTION.OUTLINER_GENERATE_OUTLINE_USER_FEEDBACK
			comment?: string
			feedback: EFeedback
			flowId: string
	  }
	| {
			action: ACTION.OUTLINER_GENERATE_CONTENT_USER_FEEDBACK
			comment?: string
			feedback: EFeedback
			flowId: string
	  }
	| {
			action: ACTION.OUTLINER_ONBOARDING_STAGE_CHANGE
			fromStage?: string
			toStage: string
	  }
	| {
			action: ACTION.OUTLINER_ONBOARDING_CHAT_START
			flowId: string
			prompt: string
	  }
	| {
			action: ACTION.OUTLINER_ONBOARDING_CHAT_END
			flowId: string
			prompt: string
			response: string
	  }
	| {
			action: ACTION.OUTLINER_ONBOARDING_SURVEY_ANSWER
			answer: string
			isCustom: boolean
			questionKey: string
	  }
	| {
			action: ACTION.OUTLINER_ONBOARDING_SURVEY_OPTIONS_GENERATE
			flowId: string
			genre: string
	  }
	| {
			action: ACTION.OUTLINER_ONBOARDING_PROFILE_RESET
	  }
	| {
			action: ACTION.OUTLINER_ONBOARDING_NEW_IDEAS_START
			flowId: string
			hasWriterProfile: boolean
	  }
	| {
			action: ACTION.OUTLINER_ONBOARDING_NEW_IDEAS_END
			flowId: string
			response: string
	  }
	| {
			action: ACTION.OUTLINER_ONBOARDING_NEW_IDEAS_REGENERATE_START
			flowId: string
			hasFileUrls: boolean
			hasPrompt: boolean
	  }
	| {
			action: ACTION.OUTLINER_ONBOARDING_NEW_IDEAS_REGENERATE_END
			flowId: string
			response: string
	  }
	| {
			action: ACTION.OUTLINER_ONBOARDING_PROFILE_UPDATE
	  }
	| {
			action: ACTION.OUTLINER_ONBOARDING_COMPLETE
			selectedIdeaTitle: string
	  }
	| {
			action: ACTION.OUTLINER_ONBOARDING_CHAT_USER_FEEDBACK
			comment?: string
			feedback: EFeedback
			flowId: string
	  }
	| {
			action: ACTION.OUTLINER_ONBOARDING_NEW_IDEAS_USER_FEEDBACK
			comment?: string
			feedback: EFeedback
			flowId: string
	  }
	| {
			action: ACTION.OUTLINER_ONBOARDING_NEW_IDEAS_REGENERATE_USER_FEEDBACK
			comment?: string
			feedback: EFeedback
			flowId: string
	  }
	| {
			action: ACTION.OUTLINER_ONBOARDING_PROFILE_USER_FEEDBACK
			comment?: string
			feedback: EFeedback
	  }
	| { action?: TAction }

export type TEventMeta = TEventExtraData &
	TConditionalMetadata & {
		content_language?: string
		route?: string
		time_since_load_start?: string
	}

export type TEvent = {
	client_ts: string
	event: TEventName
	props: string
	screen_name: TScreenName
	service?: string
	user_uid?: string
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

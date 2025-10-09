import {
	ACTION,
	EDeviceBrowser,
	EDeviceOS,
	EDeviceType,
	EVENT_TYPE,
	SCREEN_NAME,
} from '@/constants/analytics'

export type TEventData = Record<string, string | number | boolean | undefined>

export type TEventName = (typeof EVENT_TYPE)[keyof typeof EVENT_TYPE]
export type TScreenName = (typeof SCREEN_NAME)[keyof typeof SCREEN_NAME]
export type TAction = (typeof ACTION)[keyof typeof ACTION]

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
	uid?: string
}

export interface TAnalyticsPostData {
	common_fields: {
		device_id: string | null
		uid?: string
	}
	events: Array<{ data: TEventData; eventId: string }>
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

export interface TEventMeta extends TEventData {
	action?: TAction
	route?: string
	time_since_load_start?: string
}

export interface THandleEventLogClientArgs {
	event: TEventName
	metaData?: TEventMeta
	screenName: TScreenName
	sendRoute?: boolean
}

export interface THandleClientPageLoadArgs {
	metaData?: TEventMeta
	screenName: TScreenName
}

import {
	CONTENT_LANG_ALLOWED,
	EBrowserPlatformOS,
	EDeviceBrowser,
	EDeviceOS,
	EDeviceType,
	EVENT_TYPE,
} from '@/constants/analytics'
import { v4 as uuidv4 } from 'uuid'

import {
	TAnalyticsArgs,
	TAnalyticsPostData,
	TDeviceDetails,
	TEventMeta,
	THandleClientPageLoadArgs,
	THandleEventLogClientArgs,
	TParseDeviceArgs,
} from '@/types/analytics'

const ANALYTICS_URL =
	process.env.NEXT_PUBLIC_ANALYTICS_URL ||
	'https://novel-analytics-api.pocketnovel.com/v2/logging_data/log'
const QA_ANALYTICS_URL =
	process.env.NEXT_PUBLIC_QA_ANALYTICS_URL ||
	'https://qa-go-analytics.pocketfm.com'

const currentVersionTag = process.env.NEXT_PUBLIC_VERSION_TAG || ''

export const LOCAL_STORAGE_KEYS = {
	REFERRER: 'referrer',
	ENTITY_ID: 'entity_id',
	UUID: 'uuid',
	UID: 'uid',
	APP_ORIGIN: 'app_origin',
	NATIVE_APP_VERSION: 'native_app_version',
	DEVICE_DETAILS: 'device_details',
	APP_LOAD_START_TIME: 'app_load_start_time',
	CONTENT_LANGUAGE: 'content_language',
} as const

export const SESSION_STORAGE_KEYS = {
	MEDIUM: 'medium',
	CAMPAIGN: 'campaign',
	UUID: 'uuid',
} as const

export const URL_PARAMS_KEYS = {
	REFERRER: 'referrer',
	ORIGIN: 'origin',
	APP_VERSION: 'app_version',
	MEDIUM: 'medium',
	CAMPAIGN: 'campaign',
	ENTITY_ID: 'entity_id',
} as const

export const COMMON_ANALYTICS_HEADERS = {
	'app-version': '180',
	'auth-token': 'web-auth',
	'app-client': 'consumer-web',
	platform: 'copilot-web',
}
/**
 * Builds a clean analytics event payload, no browser dependencies.
 */
export function buildAnalyticsEvent({
	screenName,
	event,
	uid,
	metaData = {},
	referrer,
	medium,
	campaign,
	deviceId,
	sessionId,
	appVersionCode,
	platformString = '',
	resolution,
	currentTimestamp = Date.now(),
}: TAnalyticsArgs): TAnalyticsPostData {
	const eventId = uuidv4().replace(/-/g, '')

	const sourceParts = [
		referrer || '',
		medium ? `medium_${medium}` : '',
		campaign ? `campaign_${campaign}` : '',
	].filter(Boolean)

	const source = `${sourceParts.join('_')}_${platformString}`

	const data: TEventMeta = {
		screen_name: screenName,
		client_ts: String(currentTimestamp),
		event,
		source,
		resolution,
		app_version_code: appVersionCode,
		user_uid: uid,
	}

	// Merge metadata safely
	const optionalFieldsKeyMap: Record<string, string> = {
		phone_number: 'phone',
		button: 'module_name',
		time: 'time_spent',
	}

	for (const [key, value] of Object.entries(metaData)) {
		if (value !== undefined) {
			data[optionalFieldsKeyMap[key] ?? key] = value
		}
	}

	return {
		events: [{ data, eventId }],
		common_fields: {
			device_id: deviceId || null,
			session_id: sessionId || null,
			uid,
		},
		group: 'user_events',
	}
}

const getDeviceDetails = () => {
	return getDeviceDetailsFromBrowser()
}

/**
 * Very lightweight UA parser – no external libs.
 */
export function parseDeviceFromUserAgent({
	userAgent = '',
}: TParseDeviceArgs): TDeviceDetails {
	const ua = userAgent.toLowerCase()

	// OS detection
	const os = /windows phone/.test(ua)
		? EDeviceOS.WINDOWS_PHONE
		: /android/.test(ua)
			? EDeviceOS.ANDROID
			: /iphone|ipad|ipod/.test(ua)
				? EDeviceOS.IOS
				: /mac/.test(ua)
					? EDeviceOS.MACOS
					: /win/.test(ua)
						? EDeviceOS.WINDOWS
						: /linux/.test(ua)
							? EDeviceOS.LINUX
							: EDeviceOS.NA

	// Browser detection
	const browser = /edg|edge/.test(ua)
		? EDeviceBrowser.EDGE
		: /chrome|crios/.test(ua)
			? EDeviceBrowser.CHROME
			: /safari/.test(ua)
				? EDeviceBrowser.SAFARI
				: /firefox/.test(ua)
					? EDeviceBrowser.FIREFOX
					: /opera|opr/.test(ua)
						? EDeviceBrowser.OPERA
						: /samsungbrowser/.test(ua)
							? EDeviceBrowser.SAMSUNG
							: EDeviceBrowser.NA

	// Device type
	const type =
		/mobile/.test(ua) || /iphone|android(?!.*tablet)/.test(ua)
			? EDeviceType.MOBILE
			: /tablet|ipad/.test(ua)
				? EDeviceType.TABLET
				: EDeviceType.DESKTOP

	return { type, browser, os }
}

export function getDeviceDetailsFromBrowser() {
	if (typeof navigator === 'undefined') {
		// SSR-safe fallback
		return {
			type: EDeviceType.DESKTOP,
			browser: EDeviceBrowser.NA,
			os: EDeviceOS.NA,
		}
	}
	const ua = navigator.userAgent || ''
	const platform = navigator.platform || ''
	const deviceDetails = parseDeviceFromUserAgent({ userAgent: ua, platform })

	if (typeof localStorage !== 'undefined') {
		// SSR Guard
		// Cache it locally
		localStorage.setItem(
			LOCAL_STORAGE_KEYS.DEVICE_DETAILS,
			JSON.stringify(deviceDetails)
		)
	}

	return deviceDetails
}

function makePlatformStringFromDeviceInfo() {
	if (typeof window === 'undefined') {
		return 'na-na-na'
	} // SSR Guard

	let platformType: EBrowserPlatformOS = EBrowserPlatformOS.NA
	let platformOS = ''
	let platformBrowser = ''

	const { type, browser, os } = getDeviceDetails()

	const origin = localStorage.getItem(LOCAL_STORAGE_KEYS.APP_ORIGIN)
	// SUBJECT TO CHANGE
	if (origin) {
		if (origin.toLowerCase().includes('pfm_ios')) {
			platformOS = EBrowserPlatformOS.IOS
			platformBrowser = 'pfm'
		} else if (origin.toLowerCase().includes('pfm_android')) {
			platformOS = EBrowserPlatformOS.ANDROID
			platformBrowser = 'pfm'
		} else if (origin.toLowerCase().includes('android')) {
			platformOS = EBrowserPlatformOS.ANDROID
			platformBrowser = 'pn'
		} else if (origin.toLowerCase().includes('ios')) {
			platformOS = EBrowserPlatformOS.IOS
			platformBrowser = 'pn'
		}
	}

	platformType = platformType || type || EDeviceType.DESKTOP
	platformOS = platformOS || os || EDeviceOS.NA
	platformBrowser = platformBrowser || browser || EDeviceBrowser.NA

	return `${platformType}-${platformOS}-${platformBrowser}`
}

function handleEventLogClient({
	event,
	metaData = {},
	screenName,
	sendRoute = true,
	sendContentLanguage = true,
}: THandleEventLogClientArgs): void {
	if (typeof window === 'undefined') {
		return
	} // SSR guard

	const referrerParam = new URLSearchParams(window.location.search).get(
		URL_PARAMS_KEYS.REFERRER
	)
	if (referrerParam) {
		localStorage.setItem(LOCAL_STORAGE_KEYS.REFERRER, referrerParam)
	}

	const uid = localStorage.getItem(LOCAL_STORAGE_KEYS.UID) ?? undefined
	const deviceId =
		localStorage.getItem(LOCAL_STORAGE_KEYS.UUID) ??
		(() => {
			const newId = uuidv4().replace(/-/g, '')
			localStorage.setItem(LOCAL_STORAGE_KEYS.UUID, newId)
			return newId
		})()

	const sessionId =
		sessionStorage.getItem(SESSION_STORAGE_KEYS.UUID) ??
		(() => {
			const newId = uuidv4().replace(/-/g, '')
			sessionStorage.setItem(SESSION_STORAGE_KEYS.UUID, newId)
			return newId
		})()

	const referrer = localStorage.getItem(LOCAL_STORAGE_KEYS.REFERRER)
	const contentLanguage = localStorage.getItem(
		LOCAL_STORAGE_KEYS.CONTENT_LANGUAGE
	)
	const medium = sessionStorage.getItem(SESSION_STORAGE_KEYS.MEDIUM)
	const campaign = sessionStorage.getItem(SESSION_STORAGE_KEYS.CAMPAIGN)
	const resolution = `${window.innerWidth}*${window.innerHeight}`
	const platformString = makePlatformStringFromDeviceInfo()
	const appVersionCode = currentVersionTag ?? 0

	const metaDataToSend: TEventMeta = {
		route: sendRoute
			? window.location.pathname + window.location.search
			: undefined,
		content_language:
			contentLanguage &&
			sendContentLanguage &&
			CONTENT_LANG_ALLOWED.has(screenName)
				? contentLanguage
				: undefined,
		...metaData,
	}

	const payload = buildAnalyticsEvent({
		screenName,
		event,
		uid,
		referrer,
		medium,
		campaign,
		deviceId,
		sessionId,
		appVersionCode,
		resolution,
		platformString,
		metaData: metaDataToSend,
		deployEnv: process.env?.NEXT_PUBLIC_DEPLOY_ENV || '',
	})

	const baseUrl =
		process.env?.NEXT_PUBLIC_DEPLOY_ENV === 'production'
			? ANALYTICS_URL
			: QA_ANALYTICS_URL

	console.log({ baseUrl, payload })

	// Uncomment when logic verified
	/*
	// Skip sending on non-prod
	if (process.env?.NODE_ENV !== 'production') {
		console.log('[DEBUG] Analytics payload:', payload)
		return
	}

	fetchAPI({
	  url: "",
	  baseUrl,
	  method: 'POST',
	  headers: {
		...COMMON_ANALYTICS_HEADERS
	  },
	  body: payload,
	}).catch((err) => {
	  console.error('[Analytics] Error sending log:', err);
	});
	 */
}

function handlePageLoadEventLogClient({
	screenName,
	metaData,
}: THandleClientPageLoadArgs): void {
	if (typeof window === 'undefined') {
		return
	} // SSR guard

	const appLoadStartTime = Number(
		localStorage.getItem(LOCAL_STORAGE_KEYS.APP_LOAD_START_TIME)
	)
	let timeSinceLoadStart: string | undefined

	if (appLoadStartTime > 0) {
		timeSinceLoadStart = ((Date.now() - appLoadStartTime) / 1000).toString()
	}

	const route = window.location.pathname + window.location.search
	const meta: TEventMeta = { ...metaData, route }

	if (timeSinceLoadStart) {
		meta.time_since_load_start = timeSinceLoadStart
	}

	handleEventLogClient({
		screenName,
		event: EVENT_TYPE.PAGE_LOAD,
		metaData: meta,
	})

	localStorage.removeItem(LOCAL_STORAGE_KEYS.APP_LOAD_START_TIME)
}

export function handleWindowLocation() {
	if (typeof window === 'undefined') {
		return
	} // SSR guard

	if (window.self === window.top) {
		const searchParams = new URLSearchParams(window.location.search)

		const referrer = searchParams.get(URL_PARAMS_KEYS.REFERRER)
		const origin = searchParams.get(URL_PARAMS_KEYS.ORIGIN)
		const app_version = searchParams.get(URL_PARAMS_KEYS.APP_VERSION)
		const medium = searchParams.get(URL_PARAMS_KEYS.MEDIUM)
		const campaign = searchParams.get(URL_PARAMS_KEYS.CAMPAIGN)
		const entity_id = searchParams.get(URL_PARAMS_KEYS.ENTITY_ID)

		if (entity_id) {
			localStorage.setItem(LOCAL_STORAGE_KEYS.ENTITY_ID, entity_id)
		}
		if (medium) {
			sessionStorage.setItem(SESSION_STORAGE_KEYS.MEDIUM, medium)
		}
		if (campaign) {
			sessionStorage.setItem(SESSION_STORAGE_KEYS.CAMPAIGN, campaign)
		}

		if (!referrer) {
			if (document.referrer.includes('google')) {
				localStorage.setItem(LOCAL_STORAGE_KEYS.REFERRER, 'google')
			} else {
				localStorage.setItem(LOCAL_STORAGE_KEYS.REFERRER, 'url')
			}
		} else {
			localStorage.setItem(LOCAL_STORAGE_KEYS.REFERRER, referrer)
		}

		if (!localStorage.getItem(LOCAL_STORAGE_KEYS.UUID)) {
			const id = uuidv4().split('-').join('')
			localStorage.setItem(LOCAL_STORAGE_KEYS.UUID, id)
		}

		if (origin) {
			localStorage.setItem(LOCAL_STORAGE_KEYS.APP_ORIGIN, origin)
		}
		if (app_version) {
			localStorage.setItem(LOCAL_STORAGE_KEYS.NATIVE_APP_VERSION, app_version)
		}
	}
}

export const track = handleEventLogClient
export const trackPage = handlePageLoadEventLogClient

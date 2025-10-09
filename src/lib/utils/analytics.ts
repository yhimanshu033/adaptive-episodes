import { v4 as uuidv4 } from 'uuid'

export type TEventData = Record<string, string | number | boolean | undefined>

export interface TAnalyticsArgs {
	appVersionCode?: string | number
	campaign?: string | null
	currentTimestamp?: number
	deployEnv?: string
	deviceId?: string | null
	event: string
	medium?: string | null
	metaData?: TEventMeta
	platformString?: string
	referrer?: string | null
	resolution?: string
	screenName: string
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
	browser: string
	os: string
	type: string
}

export interface TParseDeviceArgs {
	platform?: string
	userAgent?: string
}

interface TEventMeta extends TEventData {
	route?: string
	time_since_load_start?: string
}

// const ANALYTICS_URL = process.env.NEXT_PUBLIC_ANALYTICS_URL || 'https://novel-analytics-api.pocketnovel.com/v2/logging_data/log';

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
} as const

export const SESSION_STORAGE_KEYS = {
	MEDIUM: 'medium',
	CAMPAIGN: 'campaign',
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

	const data: TEventData = {
		screen_name: screenName,
		client_ts: String(currentTimestamp),
		event,
		view_type: metaData.route,
		source,
		resolution,
		app_version_code: appVersionCode,
		user_uid: uid,
	}

	// Merge metadata safely
	const optionalFields = [
		'phone_number',
		'button',
		'module_name',
		'time',
		'entity_type',
		'entity_id',
		'time_since_load_start',
		'show_id',
		'view_id',
	]

	for (const key of optionalFields) {
		if (metaData[key] !== undefined) {
			const mappedKey =
				key === 'phone_number'
					? 'phone'
					: key === 'button'
						? 'module_name'
						: key === 'time'
							? 'time_spent'
							: key
			data[mappedKey] = metaData[key]
		}
	}

	return {
		events: [{ data, eventId }],
		common_fields: { device_id: deviceId || null, uid },
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
		? 'windowsphone'
		: /android/.test(ua)
			? 'android'
			: /iphone|ipad|ipod/.test(ua)
				? 'ios'
				: /mac/.test(ua)
					? 'macos'
					: /win/.test(ua)
						? 'windows'
						: /linux/.test(ua)
							? 'linux'
							: 'na'

	// Browser detection
	const browser = /edg|edge/.test(ua)
		? 'edge'
		: /chrome|crios/.test(ua)
			? 'chrome'
			: /safari/.test(ua)
				? 'safari'
				: /firefox/.test(ua)
					? 'firefox'
					: /opera|opr/.test(ua)
						? 'opera'
						: /samsungbrowser/.test(ua)
							? 'samsung'
							: 'na'

	// Device type
	const type =
		/mobile/.test(ua) || /iphone|android(?!.*tablet)/.test(ua)
			? 'mobile'
			: /tablet|ipad/.test(ua)
				? 'tablet'
				: 'desktop'

	return { type, browser, os }
}

export function getDeviceDetailsFromBrowser() {
	if (typeof navigator === 'undefined') {
		// SSR-safe fallback
		return { type: 'na', browser: 'na', os: 'na' }
	}
	const ua = navigator.userAgent || ''
	const platform = navigator.platform || ''
	const deviceDetails = parseDeviceFromUserAgent({ userAgent: ua, platform })

	// Cache it locally
	localStorage.setItem(
		LOCAL_STORAGE_KEYS.DEVICE_DETAILS,
		JSON.stringify(deviceDetails)
	)

	return deviceDetails
}

function makePlatformStringFromDeviceInfo() {
	if (typeof window === 'undefined') {
		return 'na-na-na'
	} // SSR Guard

	let platformType = ''
	let platformOS = ''
	let platformBrowser = ''

	const { type, browser, os } = getDeviceDetails()

	const origin = localStorage.getItem(LOCAL_STORAGE_KEYS.APP_ORIGIN)
	// SUBJECT TO CHANGE
	if (origin) {
		if (origin.toLowerCase().includes('pfm_ios')) {
			platformOS = 'ios'
			platformBrowser = 'pfm'
		} else if (origin.toLowerCase().includes('pfm_android')) {
			platformOS = 'android'
			platformBrowser = 'pfm'
		} else if (origin.toLowerCase().includes('android')) {
			platformOS = 'android'
			platformBrowser = 'pn'
		} else if (origin.toLowerCase().includes('ios')) {
			platformOS = 'ios'
			platformBrowser = 'pn'
		}
	}

	platformType = platformType || type || 'na'
	platformOS = platformOS || os || 'na'
	platformBrowser = platformBrowser || browser || 'na'

	return `${platformType}-${platformOS}-${platformBrowser}`
}

export function handleEventLogClient(
	screenName: string,
	event: string,
	metaData: TEventMeta = {}
): void {
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

	const referrer = localStorage.getItem(LOCAL_STORAGE_KEYS.REFERRER)
	const medium = sessionStorage.getItem(SESSION_STORAGE_KEYS.MEDIUM)
	const campaign = sessionStorage.getItem(SESSION_STORAGE_KEYS.CAMPAIGN)
	const resolution = `${window.innerWidth}*${window.innerHeight}`
	const platformString = makePlatformStringFromDeviceInfo()
	const appVersionCode = currentVersionTag ?? 0

	const payload = buildAnalyticsEvent({
		screenName,
		event,
		uid,
		referrer,
		medium,
		campaign,
		deviceId,
		appVersionCode,
		resolution,
		platformString,
		metaData,
		deployEnv: process.env.NEXT_PUBLIC_DEPLOY_ENV || '',
	})

	// Skip sending on non-prod
	if (process.env?.NEXT_PUBLIC_DEPLOY_ENV !== 'production') {
		console.log('[DEBUG] Analytics payload:', payload)
		return
	}

	//  Uncomment when logic confirmed
	/*
       fetch(ANALYTICS_URL, {
           method: 'POST',
           headers: {
               'Content-Type': 'application/json',
               ...COMMON_ANALYTICS_HEADERS
           },
           body: JSON.stringify(payload),
       }).catch((err) => {
           console.error('[Analytics] Error sending log:', err);
       });
     */
}

export function handlePageLoadEventLogClient(
	screenName: string,
	metaObj: TEventMeta = {}
): void {
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
	const meta: TEventMeta = { ...metaObj, route }

	if (timeSinceLoadStart) {
		meta.time_since_load_start = timeSinceLoadStart
	}

	handleEventLogClient(screenName, 'page_load', meta)

	localStorage.removeItem(LOCAL_STORAGE_KEYS.APP_LOAD_START_TIME)
}

export function handleWindowLocation() {
	if (typeof window === 'undefined') {
		return
	} // SSR guard

	if (window.location === window.parent.location) {
		const searchParams = window.parent
			? new URLSearchParams(window.parent.location.search)
			: new URLSearchParams(window.location.search)

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

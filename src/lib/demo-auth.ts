export const DEMO_AUTH_COOKIE = 'demo_auth'

export const HOME_ROUTE = '/'
export const SIGNIN_ROUTE = '/signin'
export const STORIES_ROUTE = '/stories'

export const DEMO_AUTH_STORAGE_USERS_KEY = 'demo_auth_users'
export const DEMO_AUTH_STORAGE_SESSION_EMAIL_KEY = 'demo_auth_session_email'

export function setDemoAuthCookie(email: string) {
	if (typeof document === 'undefined') {
		return
	}
	// 7-day cookie for demo purposes
	const maxAgeSeconds = 60 * 60 * 24 * 7
	document.cookie = `${DEMO_AUTH_COOKIE}=${encodeURIComponent(
		email
	)}; Max-Age=${maxAgeSeconds}; Path=/; SameSite=Lax`
}

export function clearDemoAuthCookie() {
	if (typeof document === 'undefined') {
		return
	}
	document.cookie = `${DEMO_AUTH_COOKIE}=; Max-Age=0; Path=/; SameSite=Lax`
}

export function safeJsonParse<T>(value: string | null, fallback: T): T {
	if (!value) {
		return fallback
	}
	try {
		return JSON.parse(value) as T
	} catch {
		return fallback
	}
}

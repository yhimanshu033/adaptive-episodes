import { PRIMARY_KEYS_TO_COMPARE } from '@/constants/episodes-constants'

export const COPILOT_LOGO_URL = '/assets/pocket-copilot-logo.webp'
export const FALLBACK_USER_URL = '/assets/placeholder-user.webp'

export const STORIES_QUERY_KEY = 'stories'

export const PRIMARY_BACKGROUND_COLOR = '#e6194d'

export const DB_NAME = 'COPILOT_DB'
export const STORE_NAME = 'EPISODE_DATA_STORE'
export const VERSION = 1
export const EXPIRY_TIME = 7 * 24 * 60 * 60 * 1000 // 1 week in milliseconds
export const MAX_ENTRIES = 1000

export const keyToTitle: Partial<
	Record<(typeof PRIMARY_KEYS_TO_COMPARE)[number], string>
> = {
	chapter_title: 'Chapter Title',
	comments: 'Comments',
	text: 'Content',
}

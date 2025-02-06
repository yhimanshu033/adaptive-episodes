import { PRIMARY_KEYS_TO_COMPARE } from '@/constants/episodes-constants'
import { SuggestionUser } from '@udecode/plate-suggestion'

import { ERole } from '@/types/admin-types'

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

export const ROLE_HIERARCHY: ERole[] = [
	ERole.ADMIN,
	ERole.LEAD,
	ERole.WRITER,
	ERole.READER,
]

export const roleToTitle: Record<ERole, string> = {
	[ERole.ADMIN]: 'Admin',
	[ERole.LEAD]: 'Lead',
	[ERole.WRITER]: 'Writer',
	[ERole.READER]: '',
}

export const DEFAULT_USER: Record<string, SuggestionUser> = {
	'1': {
		id: '1',
		name: 'Anonymous',
		avatarUrl: FALLBACK_USER_URL,
	},
}

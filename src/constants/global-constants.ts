import { PRIMARY_KEYS_TO_COMPARE } from '@/constants/episodes-constants'

import { ERole } from '@/types/admin-types'
import { PlateUser } from '@/types/plate-types'

export const COPILOT_LOGO_URL = '/assets/pocket-copilot-logo.webp'
export const FALLBACK_USER_URL = '/assets/placeholder-user.webp'
export const AI_AVATAR_ASSET = '/assets/ai_avatar.webp'

export const DB_NAME = 'COPILOT_DB'
export const STORE_NAME = 'EPISODE_DATA_STORE'
export const RECENT_STORE_NAME = 'RECENT_DATA_STORE'
export const CONFIGURATION_STORE_NAME = 'CONFIGURATION_DATA_STORE'
export const VERSION = 8
export const EXPIRY_TIME = 7 * 24 * 60 * 60 * 1000 // 1 week in milliseconds
export const MAX_ENTRIES = 1000

export const keyToTitle: Partial<
	Record<(typeof PRIMARY_KEYS_TO_COMPARE)[number], string>
> = {
	chapter_title: 'Chapter Title',
	comments: 'Comments',
	text: 'Content',
}

export const roleToData: Record<ERole, { priority: number; title: string }> = {
	[ERole.ADMIN]: { title: 'Admin', priority: 0 },
	[ERole.LEAD]: { title: 'Lead', priority: 1 },
	[ERole.WRITER]: { title: 'Writer', priority: 2 },
	[ERole.READER]: { title: '', priority: 3 },
}
export const rolesArray = Object.values(ERole).filter(
	(role) => role !== ERole.READER
)

export const DEFAULT_USER: Record<string, PlateUser> = {
	'1': {
		id: '1',
		name: 'Anonymous',
		avatarUrl: FALLBACK_USER_URL,
	},
}

export const validResponseStatuses = [200, 201, 204]

export const colorOptions = {
	Pink: { value: '345 80% 50%', secondary: '345 80% 85%' },
	Purple: { value: '275 80% 50%', secondary: '275 80% 85%' },
	Blue: { value: '200 80% 50%', secondary: '200 80% 85%' },
	Brown: { value: '400 80% 40%', secondary: '400 80% 85%' },
	Orange: { value: '10 80% 50%', secondary: '10 80% 85%' },
	Green: { value: '500 80% 40%', secondary: '500 80% 85%' },
} as const

export const USER_SELECTED_COLOR = 'userSelectedColor'

export const API_URLS = {
	UPDATE_WRITER: '/chapter/update-writer/:id/',
	LOCALIZATION_UPDATE: '/project/:id/update-ls-mapping/',
	LOCALIZATION_GET: '/project/:id/get-ls-sheet-url/',
	STREAM_LOCALIZATION: '/aicopilot/localize/',
	STREAM_PROJECT_UPLOAD: '/project/upload/',
	PROJECT_UPDATE: '/project/:id/',
	PROJECT_DELETE: '/project/:id/delete/',
	MEMBERS_GET: '/project/:id/get-project-members',
	LOGIN: '/auth/login/',
	GET_MY_USER: '/user/me',
	GET_USER_PROJECTS: '/user/get-user-projects',
	GET_ALL_USERS: '/user/get-all-users/',
	GIVE_PROJECT_ACCESS: '/project/:projectId/:userId/give-project-access',
	REVOKE_PROJECT_ACCESS: '/project/:projectId/:userId/revoke-project-access',
	GET_EPISODE: '/chapter/:chapterId/content/',
	SAVE_EPISODE: '/chapter/:projectId/:episodeId/',
	GET_EPISODES: '/chapter/',
	UNMERGE_EPISODES: '/chapters/unmerge/',
	INVENT_EPISODE: '/chapters/invent/',
	DELETE_EPISODE: '/chapters/:chapter_id/delete/',
	DELETE_MULTIPLE_EPISODES: '/project/:project_id/chapters/bulk-delete/',
	UPDATE_STATUS: '/chapter/update_status/:project_id/:parent_id/',
	FILE_UPLOAD: '/project/file-upload/',
	GET_METADATA: '/adapted-metadata/:projectId/:startSequence/:endSequence/',
	GET_METADATA_BASE: '/metadata/:projectId/:startSequence/:endSequence/',
	GET_STORIES: '/projects/',
	STREAM_CHATBOT: '/aicopilot/chatbot',
	STREAM_COMMENT_EXAMPLE: '/aicopilot/review-example',
	STREAM_DOCX: '/project/convert-html-to-docx/',
	STREAM_LASER: '/aicopilot/lasertools',
	STREAM_EXPLORER: '/aicopilot/explorer',
	GET_NOTES: '/user/:project_id/fetch-user-notes/',
	UPDATE_NOTES: '/user/:project_id/update-user-notes/',
	UPDATE_LOC_SHEET: '/project/:projectId/update-loc-sheet/',
	UPDATE_LOC_MAPPING: '/project/:projectId/update-localisation-data/',
	GET_LOC_SHEET: '/project/:projectId/get-loc-spreadsheet-data/',
	TRANSLATE_VIDEO: '/aicopilot/mp4-to-german/',
	UPDATE_GDRIVE_FOLDER: '/project/:projectId/update-cms-ready-drive-url/',
	UPDATE_GDRIVE_FOLDER_BASE:
		'/project/:projectId/update-base-script-drive-url/',
	PUSH_TO_GDRIVE: '/project/:projectId/upload-cms-ready-file/',
	GDRIVE_AUTH: '/user/:userId/google-drive-auth/',
	ELEVENLABS_TTS:
		'https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM/stream?output_format=mp3_44100_128',
	COPILOT_TTS: '/aicopilot/text-to-speech',
	GET_BASE_SCRIPT_EXTENSION:
		'/project/:projectId/get-base-script-extension-info/',
	EXTEND_BASE_SCRIPT: '/aicopilot/extend-base-script/',
	UPDATE_SLACK_CHANNEL: '/project/:projectId/update-slack-channel-id/',
	GET_SLACK_CHANNEL: '/project/:projectId/get-slack-channel-info/',
	SEND_TASK_TO_ADAPTATION: '/project/send-task-to-adaptation',
	GET_ADAPTATION_LS: '/project/:projectId/:language/get_ls_sheet',
	GET_STORY_DETAILS: '/projects/:storyId/',
	GET_DOC_EPISODE_COUNT: '/project/get-episode-count/',
	BULK_EPISODE_DOWNLOAD: '/project/:projectId/download/',
	BEATSHEET_GENERATE: '/aicopilot/bse',
	BULK_PROMPT_SEND: '/project/:projectId/prompt/',
	GET_SCENES_METADATA: '/scenes/metadata/',
	SCENE_PROMPT_GENERATE: '/aicopilot/bse/scene_wide',
	EPISODE_REGENERATE: '/aicopilot/nwm-extraction-pipeline/',
	CHAPTER_CHARACTERS: '/chapters/characters/',
	BEATSHEET_SCENE_UPDATE: '/scenes/update-metadata/',

	OUTLINER_CHAT: '/aicopilot/bse/chatbot',
	GET_OUTLINER_METADATA: '/project/:projectId/fetch-bse-metadata',
	UPDATE_NARRATIVE_ARCS: '/project/:projectId/narrative-arc-plan',
	OUTLINER_SUMMARY_EPISODE: '/aicopilot/bse/generate_episode',
	OUTLINER_SUMMARY_EPISODE_V2: '/aicopilot/bse/summary-to-episode/',
	OUTLINER_NEW_IDEAS: '/chapter/:episodeId/new-episode-ideas',
	OUTLINER_SUMMARY_OUTLINE: '/aicopilot/bse/summary-to-outlines/',
	OUTLINER_SAVE_CACHED_OUTLINE: '/scenes/save-cached-scenes/',

	OUTLINER_QUESTIONNAIRE_NEW_IDEAS: '/project/:projectId/new-story-idea',
	OUTLINER_QUESTIONNAIRE_STATUS: '/user/fetch-profile-stage/',
	OUTLINER_QUESTIONNAIRE_STATUS_UPDATE: '/user/profile-stage/:projectId/',
	OUTLINER_QUESTIONNAIRE_CHAT: '/user/profile-chat/',
	OUTLINER_QUESTIONNAIRE_SURVEY_QUESTIONS: '/user/survey/',
	OUTLINER_QUESTIONNAIRE_SURVEY_QUESTIONS_SUBMIT: '/user/survey/submit/',
	OUTLINER_QUESTIONNAIRE_NEW_IDEAS_REGENERATE:
		'/project/:projectId/regenerate-story-idea',
	OUTLINER_QUESTIONNAIRE_NEW_SHOWS_GENERATE:
		'/user/survey/generate-custom-shows/',
	OUTLINER_QUESTIONNAIRE_PROFILE: '/user/writer-profile',
	OUTLINER_QUESTIONNAIRE_PROFILE_RESET: '/user/reset-profile/',

	GET_ASSEMBLY_AI_TOKEN: '/user/assembly-ai-token/',

	GET_PRESIGNED_CONTENT_URL: '/chapter/generate-presigned-upload-url/',
}

export const INDEXED_DB_KEYS = {
	OPENED_PROJECTS: 'OPENED_PROJECTS',
	OPENED_EPISODE_PAGES: 'OPENED_EPISODE_PAGES',
	OPENED_EPISODES: 'OPENED_EPISODES',
	LLM_MODEL: 'LLM_MODEL',
}
export const LOGS = {
	SAVE_EPISODE: 'SAVE_EPISODE',
	STATUS_UPDATE: 'STATUS_UPDATE',
}
export type TIdParams = {
	id: string
}

export const pathsWithoutGlobalHeader = [
	'/editor',
	'/manage-project',
	'/preview',
	'/content',
	'/localize',
]

export const GDRIVE_BROADCAST_CHANNEL = 'gdrive-channel'
export const GDRIVE_SUCCESS_MESSAGE = 'gdrive-success'

export const SIMPLIFIED_VIEWABLE_EDITOR = 'sve'
export const GLOBAL_LOCALIZE = 'global-localize'
export const HIDE_HEADER = 'hide-header'
export const EPISODE_SEQUENCE = 'seq'

export const SAMPLE_DOC_LINK =
	'https://docs.google.com/document/d/1i5s7OX9vmkLPw96htixpPs_xGZlk73NbqvVAVw9zHME/edit?usp=sharing'

export const FETCHED_BUILD_VERSION_KEY = 'fetchedBuildVersion'

export const SOCKET_STREAMING_TIMEOUT = 60000 //1 minute
export const FETCH_TIMEOUT = 5000 //10 seconds

export const BEATSHEET_STREAMING_TIMEOUT = 3 * 60000 //3 minute
export const AI_CHATBOT_STREAMING_TIMEOUT = 90000 //90 seconds
export const STORY_EXPLORE_STREAMING_TIMEOUT = 90000 //90 seconds

export const MAX_SOCKET_RETRIES = 5
export const SOCKET_ERROR_TOAST_ID = 'socket-connection-error'

export const CORRELATION_ID_HEADER_KEY = 'X-Correlation-ID'

export const COMMON_SITE_HEADERS = {
	'X-Source': 'COPILOT_WEB',
}

export const IGNORE_ERROR_API_URLS = new Set([
	API_URLS.GET_BASE_SCRIPT_EXTENSION,
	API_URLS.GET_ADAPTATION_LS,
	API_URLS.GET_LOC_SHEET,
])

export const NWM_EMAIL = 'NWM_REGENERATION_WORKER'

export const CONFIGURATION_DATA_KEY = 'CONFIGURATION_DATA'

export const APP_CONFIG = {
	ENV: 'production',
	NEXT_PUBLIC_ANALYTICS_ENABLED: true,
}

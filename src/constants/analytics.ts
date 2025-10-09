export enum EBrowserPlatformOS {
	ANDROID = 'android',
	IOS = 'ios',
	NA = 'na',
}

export enum EDeviceOS {
	ANDROID = 'android',
	IOS = 'ios',
	LINUX = 'linux',
	MACOS = 'macos',
	NA = 'na',
	WINDOWS = 'windows',
	WINDOWS_PHONE = 'windowsphone',
}

export enum EDeviceBrowser {
	CHROME = 'chrome',
	EDGE = 'edge',
	FIREFOX = 'firefox',
	NA = 'na',
	OPERA = 'opera',
	SAFARI = 'safari',
	SAMSUNG = 'samsung',
}

export enum EDeviceType {
	DESKTOP = 'desktop',
	MOBILE = 'mobile',
	TABLET = 'tablet',
}

export enum EVENT_TYPE {
	BUTTON_CLICK = 'button_click',
	PAGE_LOAD = 'page_load',
	SECTION_LOAD = 'section_load',
}

export enum SCREEN_NAME {
	ADAPTATION_DIALOG = 'adaptation_dialog',
	AUTH = 'auth',
	EPISODE_EDITOR = 'episode_editor',
	EPISODE_LIST = 'episode_list',
	LANDING = 'landing',
	PROJECTS = 'projects',
	PROJECT_SETTINGS = 'project_settings',
}

export enum ACTION {
	ADAPTATION_LS_GEN = 'adaptation_ls_generation',
	ADAPTATION_LS_SEND = 'adaptation_ls_send',
	BASE_SCRIPT_EXTENSION = 'base_script_extension',
	COMMENT_EXAMPLE = 'comment_example',
	COMMENT_EXAMPLE_CANCEL = 'comment_example_cancel',
	DOWNLOAD_BULK_EPISODES = 'download_bulk_episodes',
	DUAL_VIEW_CHANGED = 'dual_view_changed',
	FIND_REPLACE_ALL = 'find_replace_all',
	FIND_REPLACE_SUGGESTION = 'find_replace_suggestion',
	LASER_CANCEL = 'laser_canceled',
	LASER_RESPONSE_ACCEPT = 'laser_response_accepted',
	LASER_RESPONSE_REJECT = 'laser_response_rejected',
	LASER_RESPONSE_RETRY = 'laser_response_retry',
	LASER_START = 'laser_started',
	NOTES_ADD = 'notes_add',
	NOTES_DELETE = 'notes_delete',
	NOTES_UPDATE = 'notes_update',
	PROMPT_BULK_EPISODES = 'prompt_bulk_episodes',
	RUN_NWM = 'run_nwm',
	SFX_ACCEPT = 'sfx_accept',
	SIDEBAR_CHANGED = 'sidebar_changed',
	STORY_CHAT_CANCEL = 'story_chat_cancel',
	STORY_CHAT_PROMPT = 'story_chat_prompt',
	STORY_CHAT_SUGGESTION = 'story_chat_suggestion',
	STORY_EXPLORER_ACTION = 'story_explorer_action',
	STORY_EXPLORER_FOCUS = 'story_explorer_focus',
	STORY_EXPLORER_TAB_CHANGE = 'story_explorer_tab_change',
	SUGGESTION_MODE = 'suggestion_mode',
	SYNC_METADATA = 'sync_metadata',
	THEME_TOGGLE = 'theme-toggle',
	TTS_TRIGGER = 'tts_trigger',
	VIEW_LS = 'view_ls',
}

export const CONTENT_LANG_ALLOWED: Set<SCREEN_NAME> = new Set([
	SCREEN_NAME.EPISODE_EDITOR,
	SCREEN_NAME.EPISODE_LIST,
	SCREEN_NAME.ADAPTATION_DIALOG,
])

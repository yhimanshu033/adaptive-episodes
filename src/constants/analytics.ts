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
}

export enum SCREEN_NAME {
	ADAPTATION_DIALOG = 'adaptation_dialog',
	AUTH = 'auth',
	EPISODE_EDITOR = 'episode_editor',
	EPISODE_LIST = 'episode_list',
	EPISODE_PREVIEW = 'episode_preview',
	LANDING = 'landing',
	PROJECTS = 'projects',
	PROJECT_SETTINGS = 'project_settings',
}

export enum EFeedback {
	DISLIKE = 'dislike',
	LIKE = 'like',
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
	OUTLINER_CHAT_END = 'outliner_chat_end',
	// outliner
	OUTLINER_CHAT_START = 'outliner_chat_start',
	OUTLINER_CHAT_USER_FEEDBACK = 'outliner_chat_user_feedback',
	OUTLINER_GENERATE_CONTENT_END = 'outliner_generate_content_end',
	OUTLINER_GENERATE_CONTENT_START = 'outliner_generate_content_start',
	OUTLINER_GENERATE_CONTENT_USER_FEEDBACK = 'outliner_generate_content_user_feedback',
	OUTLINER_GENERATE_OUTLINE_END = 'outliner_generate_outline_end',
	OUTLINER_GENERATE_OUTLINE_START = 'outliner_generate_outline_start',
	OUTLINER_GENERATE_OUTLINE_USER_FEEDBACK = 'outliner_generate_outline_user_feedback',
	OUTLINER_NARRATIVE_ARCS_END = 'outliner_narrative_arcs_end',
	OUTLINER_NARRATIVE_ARCS_START = 'outliner_narrative_arcs_start',
	OUTLINER_NARRATIVE_ARCS_USER_FEEDBACK = 'outliner_narrative_arcs_user_feedback',
	OUTLINER_NEW_IDEAS_END = 'outliner_new_ideas_end',
	OUTLINER_NEW_IDEAS_START = 'outliner_new_ideas_start',
	OUTLINER_NEW_IDEAS_USER_FEEDBACK = 'outliner_new_ideas_user_feedback',
	OUTLINER_ONBOARDING_CHAT_END = 'outliner_onboarding_chat_end',
	OUTLINER_ONBOARDING_CHAT_START = 'outliner_onboarding_chat_start',
	OUTLINER_ONBOARDING_CHAT_USER_FEEDBACK = 'outliner_onboarding_chat_user_feedback',
	OUTLINER_ONBOARDING_COMPLETE = 'outliner_onboarding_complete',
	OUTLINER_ONBOARDING_NEW_IDEAS_END = 'outliner_onboarding_new_ideas_end',
	OUTLINER_ONBOARDING_NEW_IDEAS_REGENERATE_END = 'outliner_onboarding_new_ideas_regenerate_end',
	OUTLINER_ONBOARDING_NEW_IDEAS_REGENERATE_START = 'outliner_onboarding_new_ideas_regenerate_start',
	OUTLINER_ONBOARDING_NEW_IDEAS_REGENERATE_USER_FEEDBACK = 'outliner_onboarding_new_ideas_regenerate_user_feedback',
	OUTLINER_ONBOARDING_NEW_IDEAS_START = 'outliner_onboarding_new_ideas_start',
	OUTLINER_ONBOARDING_NEW_IDEAS_USER_FEEDBACK = 'outliner_onboarding_new_ideas_user_feedback',
	OUTLINER_ONBOARDING_PROFILE_RESET = 'outliner_onboarding_profile_reset',
	OUTLINER_ONBOARDING_PROFILE_UPDATE = 'outliner_onboarding_profile_update',
	OUTLINER_ONBOARDING_PROFILE_USER_FEEDBACK = 'outliner_onboarding_profile_user_feedback',
	// outliner onboarding
	OUTLINER_ONBOARDING_STAGE_CHANGE = 'outliner_onboarding_stage_change',
	OUTLINER_ONBOARDING_SURVEY_ANSWER = 'outliner_onboarding_survey_answer',
	OUTLINER_ONBOARDING_SURVEY_OPTIONS_GENERATE = 'outliner_onboarding_survey_options_generate',
	PROMPT_BULK_EPISODES = 'prompt_bulk_episodes',
	RUN_NWM = 'run_nwm',
	SFX_ACCEPT = 'sfx_accept',
	SIDEBAR_CHANGED = 'sidebar_changed',
	STORY_CHAT_CANCEL = 'story_chat_cancel',

	STORY_CHAT_PROMPT = 'story_chat_prompt',
	STORY_CHAT_REVIEW_ADDED = 'story_chat_review_added',
	// new
	STORY_CHAT_SFX_ADDED = 'story_chat_sfx_added',
	STORY_CHAT_SINGLE_SFX_ACTION = 'single_sfx_action',
	STORY_CHAT_SUGGESTION = 'story_chat_suggestion',
	STORY_EXPLORER_ACTION = 'story_explorer_action',
	STORY_EXPLORER_FOCUS = 'story_explorer_focus',
	STORY_EXPLORER_TAB_CHANGE = 'story_explorer_tab_change',
	SUGGESTION_MODE = 'suggestion_mode',
	SYNC_METADATA = 'sync_metadata',
	THEME_TOGGLE = 'theme-toggle',
	TTS_TRIGGER = 'tts_trigger',
	VIEW_LS = 'view_ls',
	VOICE_PASS_ADDED = 'story_chat_voice_pass_added',
}

export const CONTENT_LANG_ALLOWED: Set<SCREEN_NAME> = new Set([
	SCREEN_NAME.EPISODE_EDITOR,
	SCREEN_NAME.EPISODE_LIST,
	SCREEN_NAME.ADAPTATION_DIALOG,
])

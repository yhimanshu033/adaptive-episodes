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

export const EVENT_TYPE = {
	PAGE_LOAD: 'page_load',
	BUTTON_CLICK: 'button_click',
} as const

export const SCREEN_NAME = {
	LANDING: 'landing',
	PROJECTS: 'projects',
	EPISODE_LIST: 'episode_list',
	EPISODE_EDITOR: 'episode_editor',
	PROJECT_SETTINGS: 'project_settings',
	ADAPTATION_DIALOG: 'adaptation_dialog',
	AUTH: 'auth',
} as const

export const ACTION = {
	LASER_BUTTON_CLICK: 'laser_button_clicked',
} as const

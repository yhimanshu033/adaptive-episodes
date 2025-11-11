import { EOutlinerChatMode } from '@/page-builders/plate-editor/sidebar-sections/outliner/lib/types'

export const outlinerChatModeToTitle: Record<EOutlinerChatMode, string> = {
	[EOutlinerChatMode.CHAT]: 'Chat',
	[EOutlinerChatMode.EXPAND_OUTLINE]: 'Expand Outline',
	[EOutlinerChatMode.GENERATE_CONTENT]: 'Generate Content',
	[EOutlinerChatMode.GENERATE_SELECTION]: 'Generate Selection',
}

export const OUTLINER_ENABLED_PROJECTS = new Set([101, 99])

export const OUTLINER_ENABLED_USERS = new Set([
	// DEVS
	'aanand.yadav@pocketfm.com',
	'raj.yadav1@pocketfm.com',
	'himanshu.yadav@pocketfm.com',
	'neha.n@pocketfm.com',
	'pavan.patel@pocketfm.com',
	'int-prabhu.varad@pocketfm.com',

	// LEADS
	'ilan.benjamin@pocketfm.com',
	'thomas.kornmaier@pocketfm.com',

	// USERS
])

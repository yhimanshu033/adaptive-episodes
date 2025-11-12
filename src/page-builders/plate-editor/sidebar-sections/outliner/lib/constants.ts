import { EOutlinerChatMode } from '@/page-builders/plate-editor/sidebar-sections/outliner/lib/types'

export const outlinerChatModeToTitle: Record<EOutlinerChatMode, string> = {
	[EOutlinerChatMode.CHAT]: 'Chat',
	[EOutlinerChatMode.EXPAND_OUTLINE]: 'Expand Outline',
	[EOutlinerChatMode.GENERATE_CONTENT]: 'Generate Content',
	[EOutlinerChatMode.GENERATE_SELECTION]: 'Generate Selection',
}

export const OUTLINER_ENABLED_PROJECTS = new Set([5329, 5331, 5334])

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
	'hitesh.mantrala@pocketfm.com',
	'Mayank.sancheti@pocketfm.com',
	'shubham.s@pocketfm.com',
	'prateek@pocketfm.com',

	// USERS
	'stefan.burkner@pocketfm.com',
	'Sarjita.jain@pocketfm.com',
	'con-suyash.sinha@pocketfm.com',
	'alison.goldman1@pocketfm.com',
	'patricia.vanasse@pocketfm.com',
	'maeve.schmitt@pocketfm.com',
	'frl-lee.hadan@pocketfm.com',
	'frl-rutuja.pasalkar@pocketfm.com',
	'rohan@pocketfm.com',
	'mark.mazur@pocketfm.com',
	'frl-rutuja.pasalkar@pocketfm.com',
	'padwal.sparshita@pocketfm.com',
])

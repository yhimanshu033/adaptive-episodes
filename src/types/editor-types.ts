import { LucideComponent } from './common'

export type SidebarContent = 'ai' | 'comments' | 'outline'

export interface ToolStateTypes {
	bold: boolean
	italic: boolean
	justifyCenter: boolean
	justifyLeft: boolean
	justifyRight: boolean
	underline: boolean
}

export interface EditorStoreType {
	activeSidebar: SidebarContent
	isSidebarOpen: boolean
	isTranslationOpen: boolean
	showTooltip: boolean
	toolsState: ToolStateTypes
	tooltipPosition: { left: number; top: number }
}

export type ToolsType = {
	icon: LucideComponent
	type:
		| 'bold'
		| 'italic'
		| 'underline'
		| 'justifyLeft'
		| 'justifyCenter'
		| 'justifyRight'
}[]

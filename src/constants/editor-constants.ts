import {
	AlignCenter,
	AlignLeft,
	AlignRight,
	Bold,
	Bot,
	FileText,
	Italic,
	MessageSquare,
	Underline,
} from 'lucide-react'

import { LucideComponent } from '@/types/common'
import { SidebarContent, ToolStateTypes, ToolsType } from '@/types/editor-types'

export const defaultToolStates: ToolStateTypes = {
	bold: false,
	italic: false,
	underline: false,
	justifyLeft: true,
	justifyCenter: false,
	justifyRight: false,
}

export const tools: ToolsType = [
	{
		icon: Bold,
		type: 'bold',
	},
	{
		icon: Italic,
		type: 'italic',
	},
	{
		icon: Underline,
		type: 'underline',
	},
	{
		icon: AlignLeft,
		type: 'justifyLeft',
	},
	{
		icon: AlignCenter,
		type: 'justifyCenter',
	},
	{
		icon: AlignRight,
		type: 'justifyRight',
	},
]

export const fontSizes = ['1', '2', '3', '4', '5', '6', '7']

export const sidebarSections: {
	desc: string
	icon: LucideComponent
	name: SidebarContent
}[] = [
	{
		name: 'ai',
		icon: Bot,
		desc: 'Ask AI',
	},
	{
		name: 'comments',
		icon: MessageSquare,
		desc: 'Add Comments',
	},
	{
		name: 'outline',
		icon: FileText,
		desc: 'View Outline',
	},
]

export const rephraseMethods = [
	{ id: 'shortenmore', method: 'Shorten' },
	{ id: 'expand', method: 'Expand' },
	{ id: 'expandmore', method: 'Stylize' },
	{ id: 'improve', method: 'Improve' },
	{ id: 'recap', method: 'Recap' },
	{ id: 'dialog', method: 'Dialog' },
	{ id: 'notetoscript', method: 'NoteToScript' },
	{ id: 'prompt', method: 'Prompt' },
]

export const MAIN_EDITOR_ID = 'main-editor'
export const TRANSLATION_EDITOR_ID = 'translation-editor'

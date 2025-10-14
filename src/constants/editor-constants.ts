'use client'

import { BubbleSparkleIcon } from '@/icons/bubble-sparkle-icon'
import { EditBigIcon } from '@/icons/edit-big-icon'
import { EyeOpenIcon } from '@/icons/eye-open-icon'
import { HeadIcon } from '@/icons/head-icon'
import { MusicalNoteIcon } from '@/icons/musical-note-icon'
import { SuggestionIcon } from '@/icons/suggestion-icon'
import { VerticalMenuIcon } from '@/icons/vertical-menu-icon'
import { TResolvedSuggestion } from '@platejs/suggestion'
import { LucideIcon } from 'lucide-react'

import { EChatMode, TStoryChatSuggestion } from '@/types/ai-types'
import {
	EConfigurationDialogContentTab,
	ESuggestionViewingType,
	EThemeMode,
	TStoredConfigurationData,
} from '@/types/editor-types'
import { ESidebar } from '@/types/plate-types'

export const rephraseMethods = [
	{ id: 'shortenmore', method: 'Shorten', status: 'Shortening...' },
	{ id: 'expand', method: 'Expand', status: 'Expanding...' },
	{ id: 'dialog', method: 'Dialog', status: 'Dialogizing...' },
	{ id: 'stylize', method: 'Stylize', status: 'Rewriting... (Stylize)' },
	{ id: 'custom', method: 'Prompt', status: 'Running custom prompt...' },
] as const

export const storyChatSuggestions: Array<
	TStoryChatSuggestion & {
		addSuggestion?: boolean
		icon: LucideIcon | React.ComponentType<React.SVGProps<SVGSVGElement>>
	}
> = [
	{
		value: 'SFX / Music',
		action: EChatMode.SFX,
		icon: MusicalNoteIcon,
	},
	{
		value: 'Review Content',
		action: EChatMode.REVIEW,
		icon: BubbleSparkleIcon,
	},
	{
		value: 'Voice Pass',
		action: EChatMode.VOICE2_XML,
		icon: HeadIcon,
	},
	{
		value: 'Quick Prompts',
		action: EChatMode.PROMPTS,
		icon: VerticalMenuIcon,
	},
]

export enum SuggestionActions {
	ACCEPT = 'accept',
	REJECT = 'reject',
}

export enum SuggestionTypes {
	DELETION = 'remove',
	INSERTION = 'insert',
	REPLACEMENT = 'replace',
}

export const SuggestionTypesMap: Record<TResolvedSuggestion['type'], string> = {
	remove: 'Delete',
	insert: 'Add',
	replace: 'Replace',
	update: 'Update',
}

export enum EditorModes {
	editing = 'editing',
	suggesting = 'suggesting',
	viewing = 'viewing',
}

export const editorModesList = [
	{
		mode: EditorModes.editing,
		label: 'Edit doc',
		description: 'Make changes directly',
		icon: EditBigIcon,
	},
	{
		mode: EditorModes.suggesting,
		label: 'Suggest edits',
		description: 'Without making direct changes',
		icon: SuggestionIcon,
	},
	{
		mode: EditorModes.viewing,
		label: 'Viewing',
		description: 'Read the episodes',
		icon: EyeOpenIcon,
	},
]

export const MAIN_EDITOR_ID = 'main-editor'
export const TRANSLATION_EDITOR_ID = 'translation-editor'
export const NEXT_EP_EDITOR_ID = 'next-ep-editor'
export const PREV_EP_EDITOR_ID = 'prev-ep-editor'
export const BASE_SCRIPT_EDITOR_ID = 'base-script-editor'
export const NOTE_EDITOR_BASE_ID = 'notes-editor'
export const DIFF_EDITOR_ID = 'diff-editor'
export const LOCAL_DIFF_EDITOR_ID = 'local-diff-editor'
export const DUAL_VIEW_EDITOR_ID = 'dual-view-editor'

export const LINES = 30

export const AFTER_PAGE_BREAK_CLASSNAME = 'after-editor-page' // CHECK WITH GLOBALS CSS
export const BEFORE_PAGE_BREAK_CLASSNAME = 'before-editor-page' // CHECK WITH GLOBALS CSS

export const EDITOR_FIRST_DIV_CLASSNAME = 'editor-first-div'
export const EDITOR_LAST_DIV_CLASSNAME = 'editor-last-div'

export const REMAINING_HEIGHT_CLASSNAME = 'remaining-height-padding'

export const CONSISTENT_CLASSNAMES = ['px-6', '-mx-6']

export const FOCUS_EDITOR_CLASSNAME = 'bg-background-editor'
export const UNFOCUS_EDITOR_CLASSNAME = ['border-r', 'border-l']

export const TRANSITION_DURATION = 200

export const DEFAULT_FONT_FAMILY = '--font-default'
export const FONT_RECORD: Record<string, string> = {
	Default: DEFAULT_FONT_FAMILY,
	'Times New Roman': '--font-serif',
	Georgia: '--font-georgia',
	Arial: '--font-arial',
	Verdana: '--font-verdana',
	Tahoma: '--font-tahoma',
	'Trebuchet MS': '--font-trebuchet',
	'Courier New': '--font-courier',
	Consolas: '--font-consolas',
	Impact: '--font-impact',
}

export const IGNORED_DIFF_KEYS = ['id']

export const END_ELEMENT = `<div data-slate-node="element" class="m-0 px-0 py-1 slate-p border-r border-l -mx-6" placeholder="Type a paragraph" data-block-id="test-end-element"><span data-slate-node="text"><span data-slate-leaf="true" class=""><span data-slate-zero-width="n" data-slate-length="0"><br></span></span></span></div>`

export enum farSearchModes {
	CASE_SENSITIVE = 'case-sensititve',
	GENITIVE = 'genitive',
	WHOLE_WORD = 'whole-word',
}

export const FAR_FILTER_OPTIONS = [
	{
		type: farSearchModes.CASE_SENSITIVE,
		label: 'Match case',
		key: 'caseSensitive',
	},
	{ type: farSearchModes.WHOLE_WORD, label: 'Whole word', key: 'wholeWord' },
]

export const SAVE_EPISODE_BUTTON_ID = 'save-episode-button'

export const DEFAULT_NAVIGATION_PAGE_LIMIT = 25

export const DEFAULT_INITIAL_PAGE = 1

export const FAR_PADDING_TEXT = 8

export const VIEW_SAVED_NOTES_URL = '/assets/save_notes_banner.webp'

export const AI_AVATAR = '/assets/ai_avatar.webp'

export const ESTIMATED_FLOATING_HEIGHT = 260
export const RESPONSE_GAP = 5

export const LASER_LEAF_KEYS = {
	CUSTOM_METHOD: 'laser-method-custom',
	PROMPT: 'laser-inserted-prompt',
	ADDITIONAL_CONTEXT: 'laser-additional-context',
} as const

export const beatSheetEditorAllowedProjects = [
	4861, 4863, 4866, 4873, 4881, 4935, 4944, 4952,
]

export const DEFAULT_EDITOR_CONTENT = 'No content available!'

export const DEFAULT_CONFIGURATION_DATA: TStoredConfigurationData = {
	defaultSidebar: ESidebar.CHATBOT,
	quickPrompts: [],
	suggestionDisplay: ESuggestionViewingType.CORRECTIONS,
	theme: EThemeMode.DARK,
}

export const CLOSED_SIDEBAR_VALUE = 'closed'

export const configurationDialogTabToTitle: Partial<
	Record<EConfigurationDialogContentTab, string>
> = {
	[EConfigurationDialogContentTab.QUICK_PROMPTS]:
		'Customize your quick prompts!',
}

export const HIDDEN_DATA = [
	`Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.`,
	`It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.`,
	`Why do we use it?`,
	`It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages`,
	`And web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).`,
	``,
	`Where does it come from?`,
	``,
	`Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.`,
	`The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from "de Finibus Bonorum et Malorum" by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.`,
	`Where can I get some?`,
	`There `,
]

export const configurationDialogTabToTooltipName: Record<
	EConfigurationDialogContentTab,
	string
> = {
	[EConfigurationDialogContentTab.QUICK_PROMPTS]: 'quick prompts',
	[EConfigurationDialogContentTab.OPTIONS]: 'all options',
}

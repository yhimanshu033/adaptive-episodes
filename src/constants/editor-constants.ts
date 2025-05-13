import { EChatMode, TStoryChatSuggestion } from '@/types/ai-types'

export const rephraseMethods = [
	{ id: 'shortenmore', method: '🤏 Shorten', status: 'Shortening...' },
	{ id: 'expand', method: '🤲 Expand', status: 'Expanding...' },
	{ id: 'stylize', method: '🎨 Stylize', status: 'Rewriting... (Stylize)' },
	{ id: 'dialog', method: '🗣️ Dialog', status: 'Dialogizing...' },
	{ id: 'custom', method: '💬 Prompt', status: 'Running custom prompt...' },
]

export const storyChatSuggestions: Array<TStoryChatSuggestion> = [
	{
		value: 'Music / SFX 🎶',
		action: EChatMode.SFX,
	},
	{
		value: 'Voice Pass 🎙️',
		action: EChatMode.VOICE2_XML,
	},
	{
		value: 'Review ✅',
		action: EChatMode.REVIEW,
	},
	{
		value: 'Quick Prompts 💬',
		action: EChatMode.PROMPTS,
	},
	{
		value: 'Localise 🌍',
		action: EChatMode.LOCALIZE,
	},
]

export enum SuggestionActions {
	ACCEPT = 'accept',
	REJECT = 'reject',
}

export enum SuggestionTypes {
	DELETION = 'deletion',
	INSERTION = 'insertion',
	REPLACEMENT = 'replacement',
}

export const SuggestionTypesMap: Record<SuggestionTypes, string> = {
	deletion: 'Delete',
	insertion: 'Add',
	replacement: 'Replace',
}

export const EditorModes = {
	editing: 'editing',
	suggesting: 'suggesting',
	viewing: 'viewing',
}

export const MAIN_EDITOR_ID = 'main-editor'
export const TRANSLATION_EDITOR_ID = 'translation-editor'
export const NEXT_EP_EDITOR_ID = 'next-ep-editor'
export const PREV_EP_EDITOR_ID = 'prev-ep-editor'
export const BASE_SCRIPT_EDITOR_ID = 'base-script-editor'
export const NOTE_EDITOR_BASE_ID = 'notes-editor'
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

export const SAVE_EPISODE_BUTTON_ID = 'save-episode-button'

export const EXCLUDE_BREAKDOWN_KEYS = ['laser']

export const DEFAULT_NAVIGATION_PAGE_LIMIT = 20

export const DEFAULT_INITIAL_PAGE = 1

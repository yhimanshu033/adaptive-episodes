import { EChatMode, TStoryChatSuggestion } from '@/types/ai-types'

export const rephraseMethods = [
	{ id: 'shortenmore', method: '🤏 Shorten' },
	{ id: 'expand', method: '🤲 Expand' },
	{ id: 'stylize', method: '🎨 Stylize' },
	{ id: 'dialog', method: '🗣️ Dialog' },
	{ id: 'custom', method: '💬 Prompt' },
]

export const storyChatSuggestions: Array<TStoryChatSuggestion> = [
	{
		value: 'Music / SFX 🎶',
		action: EChatMode.SFX,
	},
	{
		value: 'Voice Pass 🎙️',
		action: EChatMode.VOICE,
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
export const LINES = 30

export const AFTER_PAGE_BREAK_CLASSNAME = 'after-editor-page' // CHECK WITH GLOBALS CSS
export const BEFORE_PAGE_BREAK_CLASSNAME = 'before-editor-page' // CHECK WITH GLOBALS CSS

export const EDITOR_FIRST_DIV_CLASSNAME = 'editor-first-div'
export const EDITOR_LAST_DIV_CLASSNAME = 'editor-last-div'

export const TRANSITION_DURATION = 300

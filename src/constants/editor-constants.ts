import { EAction, TStoryChatSuggestion } from '@/types/ai-types'

export const rephraseMethods = [
	{ id: 'shortenmore', method: '🤏 Shorten' },
	{ id: 'expand', method: '🤲 Expand' },
	{ id: 'stylize', method: '🎨 Stylize' },
	{ id: 'dialog', method: '🗣️ Dialog' },
	{ id: 'custom', method: '💬 Prompt' },
]

export const storyChatSuggestions: Array<TStoryChatSuggestion> = [
	{
		value: 'Add Music / Sound FX 🎶',
		action: EAction.CHANGES,
	},
	{
		value: 'Voice Pass 🎙️',
		action: EAction.CHANGES,
	},
	{
		value: 'Review ✅',
		action: EAction.REVIEW,
	},
	{
		value: 'More...',
		action: EAction.ADD,
	},
]

export const moreChatSuggestions: Array<{ action: EAction; value: string }> = [
	{
		value: 'Fix Formatting 📄',
		action: EAction.CHANGES,
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

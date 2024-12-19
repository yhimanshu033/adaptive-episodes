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
		value: 'Add Music / Sound FX 🎶',
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
		value: 'More...',
		action: EChatMode.EXTEND,
	},
]

export const moreChatSuggestions: Array<{ action: EChatMode; value: string }> =
	[
		{
			value: 'Localization Check',
			action: EChatMode.LOCCHECK,
		},
		{
			value: 'Character Context',
			action: EChatMode.CHARCONTEXT,
		},
		{
			value: 'Plot Alternatives',
			action: EChatMode.PLOT,
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

export const rephraseMethods = [
	{ id: 'shortenmore', method: '🤏 Shorten' },
	{ id: 'expand', method: '🤲 Expand' },
	{ id: 'stylize', method: '🎨 Stylize' },
	{ id: 'dialog', method: '🗣️ Dialog' },
	{ id: 'custom', method: '💬 Prompt' },
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

export const EditorModes = {
	editing: 'editing',
	suggesting: 'suggesting',
	viewing: 'viewing',
}

export const MAIN_EDITOR_ID = 'main-editor'
export const TRANSLATION_EDITOR_ID = 'translation-editor'

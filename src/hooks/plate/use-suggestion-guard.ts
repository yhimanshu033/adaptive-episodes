import { useCallback } from 'react'
import { SuggestionPlugin } from '@platejs/suggestion/react'
import { useEditorPlugin, usePluginOption } from 'platejs/react'

export default function useSuggestionGuard() {
	const { setOption: setSuggestionOption } = useEditorPlugin(SuggestionPlugin)
	const isSuggesting = usePluginOption(SuggestionPlugin, 'isSuggesting')

	const suggestionGuard = useCallback(
		(fn: () => void) => {
			if (isSuggesting) {
				setSuggestionOption('isSuggesting', false)
				fn()
				setSuggestionOption('isSuggesting', true)
			} else {
				fn()
			}
		},
		[isSuggesting, setSuggestionOption]
	)

	return { suggestionGuard }
}

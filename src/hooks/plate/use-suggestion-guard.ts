import { useCallback } from 'react'
import { SuggestionPlugin } from '@platejs/suggestion/react'
import { useEditorPlugin, usePluginOption } from 'platejs/react'

export default function useSuggestionGuard() {
	const { setOption: setSuggestionOption } = useEditorPlugin(SuggestionPlugin)
	const isSuggesting = usePluginOption(SuggestionPlugin, 'isSuggesting')
	const currentUserId = usePluginOption(SuggestionPlugin, 'currentUserId')

	const suggestionGuard = useCallback(
		(
			fn: (isSuggesting?: boolean, currentUserId?: string | null) => void,
			ignoreGuard = false
		) => {
			if (isSuggesting && !ignoreGuard) {
				setSuggestionOption('isSuggesting', false)
				fn(true, currentUserId)
				setSuggestionOption('isSuggesting', true)
			} else {
				fn(isSuggesting, currentUserId)
			}
		},
		[isSuggesting, setSuggestionOption, currentUserId]
	)

	return { suggestionGuard }
}

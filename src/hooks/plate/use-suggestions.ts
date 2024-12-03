import { SuggestionActions } from '@/constants/editor-constants'
import { useEditorPlugin, useEditorRef } from '@udecode/plate-common/react'
import {
	acceptSuggestion,
	getActiveSuggestionDescriptions,
	rejectSuggestion,
} from '@udecode/plate-suggestion'
import { SuggestionPlugin } from '@udecode/plate-suggestion/react'

const useSuggestions = () => {
	const editor = useEditorRef()
	const { setOption, useOption } = useEditorPlugin(SuggestionPlugin)
	const activeSuggestionId = useOption('activeSuggestionId')
	const activeSuggestionDescription = getActiveSuggestionDescriptions(editor)[0]

	const suggestionAction = (action: SuggestionActions) => {
		if (action === SuggestionActions.REJECT) {
			rejectSuggestion(editor, activeSuggestionDescription)
		} else {
			acceptSuggestion(editor, activeSuggestionDescription)
		}
	}

	return {
		activeSuggestionId,
		set: setOption,
		suggestionAction,
		activeSuggestionDescription,
	}
}

export default useSuggestions

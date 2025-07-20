import { useMemo } from 'react'
import { useDebounce } from '@/hooks/use-debounce'
import { getDraftCommentKey } from '@platejs/comment'
import { useEditorPlugin, usePluginOption } from 'platejs/react'

import { commentPlugin } from '@/components/editor/plugins/comment-kit'
import { discussionPlugin } from '@/components/editor/plugins/discussion-kit'
import { suggestionPlugin } from '@/components/editor/plugins/suggestion-kit'

const useComments = () => {
	const discussions = usePluginOption(discussionPlugin, 'discussions')
	const activeCommentId = usePluginOption(commentPlugin, 'activeId')
	const { setOption, getOption } = useEditorPlugin(discussionPlugin)
	const isCommenting = activeCommentId === getDraftCommentKey()

	const { unresolvedComments, resolvedComments } = useMemo(
		() =>
			discussions.reduce(
				(acc, comment) => {
					if (comment.isResolved) {
						acc.resolvedComments.push(comment)
					} else {
						acc.unresolvedComments.push(comment)
					}
					return acc
				},
				{
					unresolvedComments: [] as typeof discussions,
					resolvedComments: [] as typeof discussions,
				}
			),
		[discussions]
	)

	return {
		activeCommentId,
		isCommenting,
		unresolvedComments,
		resolvedComments,
		setDiscussionOption: setOption,
		getDiscussionOption: getOption,
	}
}

const useSuggestions = () => {
	const suggestionsMap = usePluginOption(suggestionPlugin, 'suggestionsMap')
	const activeSuggestionId = usePluginOption(suggestionPlugin, 'activeId')
	const suggestions = useMemo(
		() => Array.from(suggestionsMap.values()).flatMap((value) => value),
		[suggestionsMap]
	)

	console.log(suggestions.length)

	const debouncedSuggestions = useDebounce(suggestions, 300)

	return {
		suggestions: debouncedSuggestions,
		activeSuggestionId,
	}
}

export { useComments, useSuggestions }

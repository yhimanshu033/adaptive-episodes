/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
	SuggestionActions,
	SuggestionTypes,
} from '@/constants/editor-constants'
import { useEditorPlugin, useEditorRef } from '@udecode/plate-common/react'
import { SlateEditor } from '@udecode/plate-core'
import {
	acceptSuggestion,
	BaseSuggestionPlugin,
	getActiveSuggestionDescriptions,
	getSuggestionKey,
	getSuggestionNodeEntries,
	getSuggestionUserIds,
	rejectSuggestion,
	TSuggestionDescription,
	TSuggestionText,
} from '@udecode/plate-suggestion'
import { SuggestionPlugin } from '@udecode/plate-suggestion/react'

const useSuggestions = () => {
	const editor = useEditorRef()
	const { setOption, useOption } = useEditorPlugin(SuggestionPlugin)
	const activeSuggestionId = useOption('activeSuggestionId')
	const activeSuggestionDescription = getActiveSuggestionDescriptions(editor)[0]

	const findAllSuggestionNodes = <E extends SlateEditor>(
		editor: E
	): Array<{ node: TSuggestionText; path: any }> => {
		const suggestionNodes: Array<{ node: TSuggestionText; path: any }> = []

		for (const [node, path] of editor.nodes<TSuggestionText>({
			match: (n) => BaseSuggestionPlugin.key in n,
			at: [],
		})) {
			suggestionNodes.push({ node, path })
		}

		return suggestionNodes
	}

	const getAllSuggestionDescriptions = (
		editor: SlateEditor
	): TSuggestionDescription[] => {
		const suggestionDescriptions: TSuggestionDescription[] = []
		const processedSuggestionIds = new Set<string>()

		const suggestionNodes = findAllSuggestionNodes(editor)

		suggestionNodes.forEach(({ node }) => {
			const suggestionId = node.suggestionId!

			if (processedSuggestionIds.has(suggestionId)) return

			processedSuggestionIds.add(suggestionId)

			const userIds = getSuggestionUserIds(node)

			userIds.forEach((userId) => {
				const nodes = Array.from(
					getSuggestionNodeEntries(editor, suggestionId, {
						match: (n: any) => n[getSuggestionKey(userId)],
					})
				).map(([node]) => node)
				const insertions = nodes.filter((node) => !node.suggestionDeletion)
				const deletions = nodes.filter((node) => node.suggestionDeletion)
				const insertedText = insertions.map((node) => node.text).join('')
				const deletedText = deletions.map((node) => node.text).join('')

				if (insertions.length > 0 && deletions.length > 0) {
					suggestionDescriptions.push({
						deletedText,
						insertedText,
						suggestionId,
						type: SuggestionTypes.REPLACEMENT,
						userId,
					})
				} else if (deletions.length > 0) {
					suggestionDescriptions.push({
						deletedText,
						suggestionId,
						type: SuggestionTypes.DELETION,
						userId,
					})
				} else if (insertions.length > 0) {
					suggestionDescriptions.push({
						insertedText,
						suggestionId,
						type: SuggestionTypes.INSERTION,
						userId,
					})
				}
			})
		})

		return suggestionDescriptions
	}
	const suggestionAction = (
		action: SuggestionActions,
		description?: TSuggestionDescription
	) => {
		if (action === SuggestionActions.REJECT) {
			rejectSuggestion(editor, description || activeSuggestionDescription)
		} else {
			acceptSuggestion(editor, description || activeSuggestionDescription)
		}
	}

	return {
		activeSuggestionId,
		set: setOption,
		suggestionAction,
		activeSuggestionDescription,
		getAllSuggestionDescriptions,
	}
}

export default useSuggestions

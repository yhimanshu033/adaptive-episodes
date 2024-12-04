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

	const createSuggestionDescription = ({
		suggestionId,
		userId,
		nodes,
	}: {
		nodes: TSuggestionText[]
		suggestionId: string
		userId: string
	}): TSuggestionDescription | null => {
		const insertedText = nodes
			.filter((node) => !node.suggestionDeletion)
			.map((node) => node.text)
			.join('')
		const deletedText = nodes
			.filter((node) => node.suggestionDeletion)
			.map((node) => node.text)
			.join('')

		if (insertedText && deletedText) {
			return {
				deletedText,
				insertedText,
				suggestionId,
				type: SuggestionTypes.REPLACEMENT,
				userId,
			}
		}

		if (deletedText) {
			return {
				deletedText,
				suggestionId,
				type: SuggestionTypes.DELETION,
				userId,
			}
		}

		if (insertedText) {
			return {
				insertedText,
				suggestionId,
				type: SuggestionTypes.INSERTION,
				userId,
			}
		}

		return null
	}

	const getAllSuggestionDescriptions = (
		editor: SlateEditor
	): TSuggestionDescription[] => {
		const processedSuggestionIds = new Set<string>()

		return findAllSuggestionNodes(editor).reduce((descriptions, { node }) => {
			const suggestionId = node.suggestionId!
			if (processedSuggestionIds.has(suggestionId)) return descriptions

			processedSuggestionIds.add(suggestionId)
			const userIds = getSuggestionUserIds(node)

			userIds.forEach((userId) => {
				const nodes = Array.from(
					getSuggestionNodeEntries(editor, suggestionId, {
						match: (n: any) => n[getSuggestionKey(userId)],
					})
				).map(([node]) => node)

				const description = createSuggestionDescription({
					suggestionId,
					userId,
					nodes,
				})

				if (description) descriptions.push(description)
			})

			return descriptions
		}, [] as TSuggestionDescription[])
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

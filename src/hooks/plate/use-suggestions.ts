/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { useCallback, useMemo } from 'react'
import {
	SuggestionActions,
	SuggestionTypes,
} from '@/constants/editor-constants'
import {
	PlateEditor,
	useEditorPlugin,
	useEditorRef,
} from '@udecode/plate-common/react'
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

// Custom hook that only subscribes to suggestion-related state
const useSuggestionEditorState = () => {
	const editor = useEditorRef()

	// Subscribe only to suggestion-related changes
	const activeSuggestionId = editor.useOption(
		SuggestionPlugin,
		'activeSuggestionId'
	)
	const users = editor.useOption(SuggestionPlugin, 'users')
	const currentUserId = editor.useOption(SuggestionPlugin, 'currentUserId')

	return {
		editor,
		activeSuggestionId,
		users,
		currentUserId,
	}
}

const useSuggestions = () => {
	const { editor, activeSuggestionId } = useSuggestionEditorState()
	const { setOption } = useEditorPlugin(SuggestionPlugin)
	const activeSuggestionDescription = getActiveSuggestionDescriptions(editor)[0]

	const findAllSuggestionNodes = useCallback(
		<E extends PlateEditor>(
			editor: E
		): Array<{ node: TSuggestionText; path: any }> =>
			Array.from(
				editor.nodes<TSuggestionText>({
					match: (n) => BaseSuggestionPlugin.key in n,
					at: [],
				}),
				([node, path]) => ({ node, path })
			),
		[]
	)

	const createSuggestionDescription = useCallback(
		({
			suggestionId,
			userId,
			nodes,
		}: {
			nodes: TSuggestionText[]
			suggestionId: string
			userId: string
		}): TSuggestionDescription | null => {
			const { insertedText, deletedText } = nodes.reduce(
				(acc, node) => {
					if (node.suggestionDeletion) {
						acc.deletedText += node.text
					} else {
						acc.insertedText += node.text
					}
					return acc
				},
				{ insertedText: '', deletedText: '' }
			)

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
		},
		[]
	)

	const getAllSuggestionDescriptions = useCallback(
		(editor: PlateEditor): TSuggestionDescription[] => {
			const processedSuggestionIds = new Set<string>()

			return findAllSuggestionNodes(editor).reduce<TSuggestionDescription[]>(
				(descriptions, { node }) => {
					const suggestionId = node.suggestionId!
					if (processedSuggestionIds.has(suggestionId)) {
						return descriptions
					}

					processedSuggestionIds.add(suggestionId)

					getSuggestionUserIds(node).forEach((userId) => {
						const nodes = Array.from(
							getSuggestionNodeEntries(editor, suggestionId, {
								match: (n: any) => n[getSuggestionKey(userId)],
							}),
							([node]) => node
						)

						const description = createSuggestionDescription({
							suggestionId,
							userId,
							nodes,
						})

						if (description) {
							descriptions.push(description)
						}
					})

					return descriptions
				},
				[]
			)
		},
		[findAllSuggestionNodes, createSuggestionDescription]
	)

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

	const isLastLeaf = useCallback(
		(leaf: TSuggestionText) => {
			const nodes = findAllSuggestionNodes(editor).filter(
				({ node }) => node.suggestionId === leaf.suggestionId
			)
			return nodes[nodes.length - 1].node.text === leaf.text
		},
		[editor, findAllSuggestionNodes]
	)

	// Memoize descriptions to avoid recalculating on every render
	// Only recalculate when suggestion nodes change
	const descriptions = useMemo(() => {
		return getAllSuggestionDescriptions(editor)
	}, [getAllSuggestionDescriptions, editor])

	return {
		activeSuggestionId,
		set: setOption,
		suggestionAction,
		activeSuggestionDescription,
		getAllSuggestionDescriptions,
		isLastLeaf,
		descriptions,
	}
}

export default useSuggestions

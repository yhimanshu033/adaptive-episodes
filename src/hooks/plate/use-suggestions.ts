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

const useSuggestions = () => {
	const editor = useEditorRef()
	const { setOption, useOption } = useEditorPlugin(SuggestionPlugin)
	const activeSuggestionId = useOption('activeSuggestionId')
	const activeSuggestionDescription = getActiveSuggestionDescriptions(editor)[0]

	// Memoize all suggestion nodes to prevent repeated calculations
	const allSuggestionNodes = useMemo(
		() =>
			Array.from(
				editor.nodes<TSuggestionText>({
					match: (n) => BaseSuggestionPlugin.key in n,
					at: [],
				}),
				([node, path]) => ({ node, path })
			),
		[editor]
	)

	// Create a map of suggestion nodes grouped by suggestionId for O(1) lookup
	const suggestionNodesMap = useMemo(() => {
		const map = new Map<string, Array<{ node: TSuggestionText; path: any }>>()

		allSuggestionNodes.forEach(({ node, path }) => {
			const suggestionId = node.suggestionId!
			if (!map.has(suggestionId)) {
				map.set(suggestionId, [])
			}
			map.get(suggestionId)!.push({ node, path })
		})

		return map
	}, [allSuggestionNodes])

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

	// Memoize all suggestion descriptions to prevent repeated calculations
	const getAllSuggestionDescriptions = useMemo(
		() =>
			(editor: PlateEditor): TSuggestionDescription[] => {
				const descriptions: TSuggestionDescription[] = []

				// Use the pre-computed map instead of filtering on every iteration
				for (const [suggestionId, suggestionNodes] of suggestionNodesMap) {
					const userIds = new Set<string>()

					// Collect unique user IDs for this suggestion
					suggestionNodes.forEach(({ node }) => {
						getSuggestionUserIds(node).forEach((userId) => userIds.add(userId))
					})

					// Process each user ID
					userIds.forEach((userId) => {
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
				}

				return descriptions
			},
		[suggestionNodesMap, createSuggestionDescription]
	)

	const suggestionAction = useCallback(
		(action: SuggestionActions, description?: TSuggestionDescription) => {
			if (action === SuggestionActions.REJECT) {
				rejectSuggestion(editor, description || activeSuggestionDescription)
			} else {
				acceptSuggestion(editor, description || activeSuggestionDescription)
			}
		},
		[editor, activeSuggestionDescription]
	)

	const isLastLeaf = useCallback(
		(leaf: TSuggestionText) => {
			const nodes = suggestionNodesMap.get(leaf.suggestionId!) || []
			return nodes.length > 0 && nodes[nodes.length - 1].node.text === leaf.text
		},
		[suggestionNodesMap]
	)

	return {
		activeSuggestionId,
		set: setOption,
		suggestionAction,
		activeSuggestionDescription,
		getAllSuggestionDescriptions,
		isLastLeaf,
	}
}

export default useSuggestions

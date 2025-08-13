/* eslint-disable @typescript-eslint/no-unused-vars */
import { Descendant, TSuggestionText, Value } from 'platejs'

export function migrateOldSuggestions(
	value: Value,
	getTimestamp: () => number = () => Date.now()
): Value {
	return value.map((node) => transformNode(node, getTimestamp)) as Value
}

function transformNode(
	node: Descendant,
	getTimestamp: () => number
): Descendant {
	// Handle elements recursively
	if ('children' in node && Array.isArray(node.children)) {
		const transformedChildren = (node.children as Descendant[]).map((child) =>
			transformNode(child, getTimestamp)
		)
		const { suggestion, ...rest } = node as Record<string, unknown>
		return {
			...rest,
			children: transformedChildren,
		} as Descendant
	}

	// Handle TText nodes
	if (node.suggestion === true && typeof node.suggestionId === 'string') {
		const suggestionId = node.suggestionId
		const userId = extractUserIdFromLegacyKeys(node)
		if (!userId) {
			return node
		}

		const newSuggestionKey = `suggestion_${suggestionId}`
		const type: 'insert' | 'remove' =
			node.suggestionDeletion === true ? 'remove' : 'insert'

		// Remove old keys including all `suggestion_<userId>`: true legacy keys
		const cleanedNode: Record<string, unknown> = {}
		for (const [key, value] of Object.entries(node)) {
			if (
				key === 'suggestionId' ||
				key === 'suggestionDeletion' ||
				isLegacySuggestionKey(key, value)
			) {
				continue // skip old keys
			}
			cleanedNode[key] = value
		}

		return {
			...cleanedNode,
			suggestion: true,
			[newSuggestionKey]: {
				id: suggestionId,
				userId,
				type,
				createdAt: getTimestamp(),
			},
		} as TSuggestionText
	}

	return node
}

function isLegacySuggestionKey(key: string, value: unknown): boolean {
	return /^suggestion_\w+$/.test(key) && value === true
}

function extractUserIdFromLegacyKeys(
	node: Record<string, unknown>
): string | null {
	for (const key of Object.keys(node)) {
		if (isLegacySuggestionKey(key, node[key])) {
			const [, userId] = key.split('_')
			return userId
		}
	}
	return null
}

'use client'

import React from 'react'
import {
	BaseSuggestionPlugin,
	type BaseSuggestionConfig,
} from '@platejs/suggestion'
import {
	isSlateEditor,
	isSlateElement,
	isSlateString,
	type ExtendConfig,
	type Path,
} from 'platejs'
import { toTPlatePlugin } from 'platejs/react'

import { BlockSuggestion } from '@/components/plate-ui-v2/block-suggestion'
import {
	SuggestionLeaf,
	SuggestionLineBreak,
} from '@/components/plate-ui-v2/suggestion-node'

import { useCreateDiscussionKit } from './discussion-kit'

export type SuggestionConfig = ExtendConfig<
	BaseSuggestionConfig,
	{
		activeId: string | null
		hoverId: string | null
		uniquePathMap: Map<string, Path>
	}
>

export const useSuggestionPlugin = () => {
	const discussionPlugin = useCreateDiscussionKit()

	const suggestionPlugin = toTPlatePlugin<SuggestionConfig>(
		BaseSuggestionPlugin,
		({ editor }) => ({
			options: {
				activeId: null,
				currentUserId: editor.getOption(discussionPlugin, 'currentUserId'),
				hoverId: null,
				uniquePathMap: new Map(),
			},
		})
	).configure({
		handlers: {
			// unset active suggestion when clicking outside of suggestion
			onClick: ({ api, event, setOption, type }) => {
				let leaf = event.target as HTMLElement
				let isSet = false

				const unsetActiveSuggestion = () => {
					setOption('activeId', null)
					isSet = true
				}

				if (!isSlateString(leaf)) {
					unsetActiveSuggestion()
				}

				while (
					leaf.parentElement &&
					!isSlateElement(leaf.parentElement) &&
					!isSlateEditor(leaf.parentElement)
				) {
					if (leaf.classList.contains(`slate-${type}`)) {
						const suggestionEntry = api.suggestion.node({ isText: true })

						if (!suggestionEntry) {
							unsetActiveSuggestion()

							break
						}

						const id = api.suggestion.nodeId(suggestionEntry[0])

						setOption('activeId', id ?? null)
						isSet = true

						break
					}

					leaf = leaf.parentElement
				}

				if (!isSet) {
					unsetActiveSuggestion()
				}
			},
		},
		render: {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
			belowNodes: SuggestionLineBreak as any,
			node: SuggestionLeaf,
			belowRootNodes: ({ api, element }) => {
				if (!api.suggestion.isBlockSuggestion(element)) {
					return null
				}

				return <BlockSuggestion element={element} />
			},
		},
	})
	return suggestionPlugin
}

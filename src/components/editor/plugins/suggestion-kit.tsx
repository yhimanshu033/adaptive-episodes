/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
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

import {
	BlockSuggestion,
	ResolvedSuggestion,
} from '@/components/plate-ui-v2/block-suggestion'
import {
	SuggestionLeaf,
	SuggestionLineBreak,
} from '@/components/plate-ui-v2/suggestion-node'

export type SuggestionConfig = ExtendConfig<
	BaseSuggestionConfig,
	{
		activeId: string | null
		hoverId: string | null
		suggestionsMap: Map<string, ResolvedSuggestion[]>
		uniquePathMap: Map<string, Path>
	}
>

export const suggestionPlugin = toTPlatePlugin<SuggestionConfig>(
	BaseSuggestionPlugin,
	{
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
						const suggestionEntry = api.suggestion!.node({ isText: true })

						if (!suggestionEntry) {
							unsetActiveSuggestion()

							break
						}

						const id = api.suggestion!.nodeId(suggestionEntry[0])

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
		options: {
			activeId: null,
			currentUserId: '1',
			hoverId: null,
			uniquePathMap: new Map(),
			suggestionsMap: new Map(),
		},
	}
).configure({
	render: {
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

export const SuggestionKit = [suggestionPlugin]

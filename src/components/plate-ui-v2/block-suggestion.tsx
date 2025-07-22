/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import * as React from 'react'
import { SuggestionTypesMap } from '@/constants/editor-constants'
import { roleToData } from '@/constants/global-constants'
import { CrossIcon } from '@/icons/cross-icon'
import { TickIcon } from '@/icons/tick-icon'
import type { TResolvedSuggestion } from '@platejs/suggestion'
import {
	acceptSuggestion,
	getSuggestionKey,
	keyId2SuggestionId,
	rejectSuggestion,
} from '@platejs/suggestion'
import {
	ElementApi,
	KEYS,
	PathApi,
	TextApi,
	type NodeEntry,
	type Path,
	type TElement,
	type TSuggestionElement,
	type TSuggestionText,
} from 'platejs'
import { useEditorPlugin, usePluginOption } from 'platejs/react'

import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from '@/components/aural-ui/avatar'
import { Button } from '@/components/aural-ui/button'
import {
	discussionPlugin,
	type TDiscussion,
} from '@/components/editor/plugins/discussion-kit'
import { cn } from '@/lib/aural-ui/utils'

import Badge from '../aural-ui/badge'
import { If } from '../aural-ui/if-else'
import { Typography } from '../aural-ui/typography'
import { commentPlugin } from '../editor/plugins/comment-kit'
import { suggestionPlugin } from '../editor/plugins/suggestion-kit'
import { type TComment } from './comment'

export interface ResolvedSuggestion extends TResolvedSuggestion {
	comments: TComment[]
}

const BLOCK_SUGGESTION = '__block__'

export const TYPE_TEXT_MAP: Record<string, (node?: TElement) => string> = {
	[KEYS.audio]: () => 'Audio',
	[KEYS.blockquote]: () => 'Blockquote',
	[KEYS.callout]: () => 'Callout',
	[KEYS.codeBlock]: () => 'Code Block',
	[KEYS.column]: () => 'Column',
	[KEYS.equation]: () => 'Equation',
	[KEYS.file]: () => 'File',
	[KEYS.h1]: () => `Heading 1`,
	[KEYS.h2]: () => `Heading 2`,
	[KEYS.h3]: () => `Heading 3`,
	[KEYS.h4]: () => `Heading 4`,
	[KEYS.h5]: () => `Heading 5`,
	[KEYS.h6]: () => `Heading 6`,
	[KEYS.hr]: () => 'Horizontal Rule',
	[KEYS.img]: () => 'Image',
	[KEYS.mediaEmbed]: () => 'Media',
	[KEYS.p]: (node) => {
		if (node?.[KEYS.listType] === KEYS.listTodo) {
			return 'Todo List'
		}
		if (node?.[KEYS.listType] === KEYS.ol) {
			return 'Ordered List'
		}
		if (node?.[KEYS.listType] === KEYS.ul) {
			return 'List'
		}

		return 'Paragraph'
	},
	[KEYS.table]: () => 'Table',
	[KEYS.toc]: () => 'Table of Contents',
	[KEYS.toggle]: () => 'Toggle',
	[KEYS.video]: () => 'Video',
}

export function BlockSuggestion({ element }: { element: TSuggestionElement }) {
	const suggestionData = element.suggestion

	if (suggestionData?.isLineBreak) {
		return null
	}

	const isRemove = suggestionData?.type === 'remove'

	return (
		<div
			className={cn(
				'border-brand/[0.8] pointer-events-none absolute inset-0 z-1 border-2 transition-opacity',
				isRemove && 'border-gray-300'
			)}
			contentEditable={false}
		/>
	)
}

export function BlockSuggestionCard({
	idx,
	suggestion,
	isPopover = false,
}: {
	idx: number
	isLast: boolean
	isPopover?: boolean
	suggestion: ResolvedSuggestion
}) {
	const { api, editor, setOption } = useEditorPlugin(suggestionPlugin)
	const { setOption: setCommentOption } = useEditorPlugin(commentPlugin)

	const userInfo = usePluginOption(discussionPlugin, 'user', suggestion.userId)
	const userTitle = userInfo?.role ? roleToData[userInfo.role]?.title : ''

	const activeSuggestionId = usePluginOption(suggestionPlugin, 'activeId')

	const isActive = suggestion.suggestionId === activeSuggestionId

	const accept = (suggestion: ResolvedSuggestion) => {
		api.suggestion.withoutSuggestions(() => {
			acceptSuggestion(editor, suggestion)
		})
	}

	const reject = (suggestion: ResolvedSuggestion) => {
		api.suggestion.withoutSuggestions(() => {
			rejectSuggestion(editor, suggestion)
		})
	}

	const suggestionText2Array = (text: string) => {
		if (text === BLOCK_SUGGESTION) {
			return ['line breaks']
		}

		return text.split(BLOCK_SUGGESTION).filter(Boolean)
	}

	const suggestedText = React.useMemo(() => {
		if (suggestion.type === 'remove') {
			return (
				suggestionText2Array(suggestion.text!)
					.map((text) => `"${text}"`)
					.join(', ') || ''
			)
		} else if (suggestion.type === 'insert') {
			return (
				suggestionText2Array(suggestion.newText!)
					.map((text) => `"${text || 'line breaks'}"`)
					.join(', ') || ''
			)
		} else if (suggestion.type === 'replace') {
			const oldTexts = suggestionText2Array(suggestion.text!)
				.map((text) => `"${text || 'line breaks'}"`)
				.join(', ')
			const newTexts = suggestionText2Array(suggestion.newText!)
				.map((text) => `"${text || 'line breaks'}"`)
				.join(', ')
			return `${oldTexts} with ${newTexts}` || ''
		} else if (suggestion.type === 'update') {
			const oldProps = Object.keys(suggestion.properties)
				.map((key) => `Un${key}`)
				.join(', ')
			const newProps = Object.keys(suggestion.newProperties)
				.map((key) => key.charAt(0).toUpperCase() + key.slice(1))
				.join(', ')
			return `${oldProps} ${newProps} "${suggestion.newText}"` || ''
		}
		return ''
	}, [suggestion])

	return (
		<div
			key={`${suggestion.suggestionId}-${idx}`}
			className={cn(
				'border-fm-divider-tertiary relative rounded-xs border bg-transparent p-4',
				{ 'border-fm-divider-secondary bg-fm-divider-secondary/15': isActive }
			)}
			onClick={() => {
				setOption('activeId', suggestion.suggestionId)
				setCommentOption('activeId', null)
				const elem = document.getElementById(
					'suggestion-leaf-' + suggestion.suggestionId
				)
				if (!elem) {
					return
				}
				elem?.scrollIntoView({ block: 'center', behavior: 'smooth' })
			}}
		>
			<div className="space-y-3">
				<div className="relative flex items-center">
					<div className="flex items-center gap-2">
						<Avatar className="size-8">
							<AvatarImage alt={userInfo?.name} src={userInfo?.avatarUrl} />
							<AvatarFallback>{userInfo?.name?.[0]}</AvatarFallback>
						</Avatar>
						<div className="flex flex-col">
							<div className="flex gap-2">
								<Typography color="primary" variant="body-small">
									{userInfo?.name}
								</Typography>
								<If condition={!!userTitle}>
									<Badge size="xs">{userTitle}</Badge>
								</If>
							</div>
						</div>
					</div>
				</div>

				<div>
					<Typography
						as="span"
						color="primary"
						variant="body-small"
						transform="uppercase"
					>
						{SuggestionTypesMap[suggestion.type]} :{' '}
					</Typography>
					<Typography
						as="span"
						className="break-words whitespace-pre-wrap"
						color="tertiary"
						variant="body-small"
					>
						{suggestedText}
					</Typography>
				</div>

				<div className="item-center flex gap-2">
					<Button
						variant="outline"
						onClick={() => reject(suggestion)}
						className="w-full"
						innerClassName={cn('h-9 border-fm-divider-secondary text-fm-sm', {
							'border-fm-divider-primary': isPopover,
						})}
						leftIcon={<CrossIcon className="size-3 stroke-2" />}
					>
						Reject
					</Button>
					<Button
						variant="outline"
						onClick={() => accept(suggestion)}
						leftIcon={<TickIcon className="size-4" />}
						className="w-full"
						innerClassName={cn('h-9 border-fm-divider-secondary text-fm-sm', {
							'border-fm-divider-primary': isPopover,
						})}
					>
						Accept
					</Button>
				</div>
			</div>
		</div>
	)
}

export const MemoizedBlockSuggestionCard = React.memo(BlockSuggestionCard)

export const useResolveSuggestion = (
	suggestionNodes: NodeEntry<TElement | TSuggestionText>[],
	blockPath: Path
) => {
	const discussions = usePluginOption(discussionPlugin, 'discussions')

	const { api, editor, getOption, setOption } =
		useEditorPlugin(suggestionPlugin)

	const suggestionsMap = getOption('suggestionsMap')

	suggestionNodes.forEach(([node]) => {
		const id = api.suggestion.nodeId(node)
		const map = getOption('uniquePathMap')

		if (!id) {
			return
		}

		const previousPath = map.get(id)

		// If there are no suggestion nodes in the corresponding path in the map, then update it.
		if (PathApi.isPath(previousPath)) {
			const nodes = api.suggestion.node({
				id,
				at: previousPath,
				isText: true,
			})
			const parentNode = api.node(previousPath)
			let lineBreakId: string | null = null

			if (parentNode && ElementApi.isElement(parentNode[0])) {
				lineBreakId = api.suggestion.nodeId(parentNode[0]) ?? null
			}

			if (!nodes && lineBreakId !== id) {
				return setOption('uniquePathMap', new Map(map).set(id, blockPath))
			}

			return
		}
		setOption('uniquePathMap', new Map(map).set(id, blockPath))
	})

	const resolvedSuggestion: ResolvedSuggestion[] = React.useMemo(() => {
		const map = getOption('uniquePathMap')

		if (suggestionNodes.length === 0) {
			return []
		}

		const suggestionIds = new Set(
			suggestionNodes
				.flatMap(([node]) => {
					if (TextApi.isText(node)) {
						const dataList = api.suggestion.dataList(node)
						const includeUpdate = dataList.some(
							(data) => data.type === 'update'
						)

						if (!includeUpdate) {
							return api.suggestion.nodeId(node)
						}

						return dataList
							.filter((data) => data.type === 'update')
							.map((d) => d.id)
					}
					if (ElementApi.isElement(node)) {
						return api.suggestion.nodeId(node)
					}
				})
				.filter(Boolean)
		)

		const res: ResolvedSuggestion[] = []

		suggestionIds.forEach((id) => {
			if (!id) {
				return
			}

			const path = map.get(id)

			if (!path || !PathApi.isPath(path)) {
				return
			}
			if (!PathApi.equals(path, blockPath)) {
				return
			}

			const entries = [
				...editor.api.nodes<TElement | TSuggestionText>({
					at: [],
					mode: 'all',
					match: (n) =>
						(n[KEYS.suggestion] && n[getSuggestionKey(id)]) ||
						api.suggestion.nodeId(n as TElement) === id,
				}),
			]

			// move line break to the end
			entries.sort(([, path1], [, path2]) => {
				return PathApi.isChild(path1, path2) ? -1 : 1
			})

			let newText = ''
			let text = ''
			let properties: any = {}
			let newProperties: any = {}

			// overlapping suggestion
			entries.forEach(([node]) => {
				if (TextApi.isText(node)) {
					const dataList = api.suggestion.dataList(node)

					dataList.forEach((data) => {
						if (data.id !== id) {
							return
						}

						switch (data.type) {
							case 'insert': {
								newText += node.text

								break
							}
							case 'remove': {
								text += node.text

								break
							}
							case 'update': {
								properties = {
									...properties,
									...data.properties,
								}

								newProperties = {
									...newProperties,
									...data.newProperties,
								}

								newText += node.text

								break
							}
							// No default
						}
					})
				} else {
					const lineBreakData = api.suggestion.isBlockSuggestion(node)
						? node.suggestion
						: undefined

					if (lineBreakData?.id !== keyId2SuggestionId(id)) {
						return
					}
					if (lineBreakData.type === 'insert') {
						newText += lineBreakData.isLineBreak
							? BLOCK_SUGGESTION
							: BLOCK_SUGGESTION + TYPE_TEXT_MAP[node.type](node)
					} else if (lineBreakData.type === 'remove') {
						text += lineBreakData.isLineBreak
							? BLOCK_SUGGESTION
							: BLOCK_SUGGESTION + TYPE_TEXT_MAP[node.type](node)
					}
				}
			})

			if (entries.length === 0) {
				return
			}

			const nodeData = api.suggestion.suggestionData(entries[0][0])

			if (!nodeData) {
				return
			}

			// const comments = data?.discussions.find((d) => d.id === id)?.comments;
			const comments =
				discussions.find((s: TDiscussion) => s.id === id)?.comments || []
			const createdAt = new Date(nodeData.createdAt)

			const keyId = getSuggestionKey(id)

			if (nodeData.type === 'update') {
				return res.push({
					comments,
					createdAt,
					keyId,
					newProperties,
					newText,
					properties,
					suggestionId: keyId2SuggestionId(id),
					type: 'update',
					userId: nodeData.userId,
				})
			}
			if (newText.length > 0 && text.length > 0) {
				return res.push({
					comments,
					createdAt,
					keyId,
					newText,
					suggestionId: keyId2SuggestionId(id),
					text,
					type: 'replace',
					userId: nodeData.userId,
				})
			}
			if (newText.length > 0) {
				return res.push({
					comments,
					createdAt,
					keyId,
					newText,
					suggestionId: keyId2SuggestionId(id),
					type: 'insert',
					userId: nodeData.userId,
				})
			}
			if (text.length > 0) {
				return res.push({
					comments,
					createdAt,
					keyId,
					suggestionId: keyId2SuggestionId(id),
					text,
					type: 'remove',
					userId: nodeData.userId,
				})
			}
		})

		return res
	}, [
		api.suggestion,
		blockPath,
		discussions,
		editor.api,
		getOption,
		suggestionNodes,
	])

	const pathKey = blockPath.join('-')
	const currentSuggestions = suggestionsMap.get(pathKey)

	if (resolvedSuggestion.length === 0) {
		if (currentSuggestions) {
			const newSuggestionsMap = new Map(suggestionsMap)
			newSuggestionsMap.delete(pathKey)
			setOption('suggestionsMap', newSuggestionsMap)
		}
	} else if (
		!currentSuggestions ||
		JSON.stringify(currentSuggestions) !== JSON.stringify(resolvedSuggestion)
	) {
		setOption(
			'suggestionsMap',
			new Map(suggestionsMap).set(pathKey, resolvedSuggestion)
		)
	}

	return resolvedSuggestion
}

export const isResolvedSuggestion = (
	suggestion: ResolvedSuggestion | TDiscussion
): suggestion is ResolvedSuggestion => {
	return 'suggestionId' in suggestion
}

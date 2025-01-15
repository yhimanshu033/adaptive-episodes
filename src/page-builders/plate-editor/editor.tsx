/* eslint-disable @typescript-eslint/no-unsafe-assignment */
'use client'

import React, { useEffect, useRef } from 'react'
import { AI_USER_ID } from '@/constants/ai-constants'
import useEpisodeContent from '@/hooks/query/use-episode-content'
import { ChatbotProvider } from '@/hooks/use-ai-chatbot'
import { extendStore } from '@/hooks/use-editor-extend-state'
import Title from '@/page-builders/plate-editor/title'
import Translation from '@/page-builders/plate-editor/translation'
import { useGlobalStore } from '@/store/global-store'
import { useQueryClient } from '@tanstack/react-query'
import { cn, withProps } from '@udecode/cn'
import { AlignPlugin } from '@udecode/plate-alignment/react'
import { AutoformatPlugin } from '@udecode/plate-autoformat/react'
import {
	BoldPlugin,
	ItalicPlugin,
	StrikethroughPlugin,
	UnderlinePlugin,
} from '@udecode/plate-basic-marks/react'
import { BlockquotePlugin } from '@udecode/plate-block-quote/react'
import { ExitBreakPlugin, SoftBreakPlugin } from '@udecode/plate-break/react'
import {
	isCodeBlockEmpty,
	isSelectionAtCodeBlockStart,
	unwrapCodeBlock,
} from '@udecode/plate-code-block'
import { CodeBlockPlugin } from '@udecode/plate-code-block/react'
import { TComment } from '@udecode/plate-comments'
import { CommentsPlugin } from '@udecode/plate-comments/react'
import {
	HtmlPlugin,
	isBlockAboveEmpty,
	isSelectionAtBlockStart,
} from '@udecode/plate-common'
import {
	createPlateEditor,
	ParagraphPlugin,
	Plate,
	PlateLeaf,
} from '@udecode/plate-common/react'
import { DocxPlugin } from '@udecode/plate-docx'
import {
	FontBackgroundColorPlugin,
	FontColorPlugin,
} from '@udecode/plate-font/react'
import { HEADING_KEYS, HEADING_LEVELS } from '@udecode/plate-heading'
import { HeadingPlugin } from '@udecode/plate-heading/react'
import { HighlightPlugin } from '@udecode/plate-highlight/react'
import { HorizontalRulePlugin } from '@udecode/plate-horizontal-rule/react'
import { HtmlReactPlugin } from '@udecode/plate-html/react'
import { IndentListPlugin } from '@udecode/plate-indent-list/react'
import { IndentPlugin } from '@udecode/plate-indent/react'
import { JuicePlugin } from '@udecode/plate-juice'
import { KbdPlugin } from '@udecode/plate-kbd/react'
import { LineHeightPlugin } from '@udecode/plate-line-height/react'
import { TodoListPlugin } from '@udecode/plate-list/react'
import { MarkdownPlugin } from '@udecode/plate-markdown'
import { ImagePlugin } from '@udecode/plate-media/react'
import { NodeIdPlugin } from '@udecode/plate-node-id'
import { ResetNodePlugin } from '@udecode/plate-reset-node/react'
import { SelectOnBackspacePlugin } from '@udecode/plate-select'
import { SuggestionPlugin } from '@udecode/plate-suggestion/react'
import {
	TableCellHeaderPlugin,
	TableCellPlugin,
} from '@udecode/plate-table/react'
import { TrailingBlockPlugin } from '@udecode/plate-trailing-block'
import { useShallow } from 'zustand/react/shallow'

import { Loader } from '@/components/loader'
import { CommentLeaf } from '@/components/plate-ui/comment-leaf'
import {
	CursorOverlay,
	DragOverCursorPlugin,
} from '@/components/plate-ui/cursor-overlay'
import { Editor } from '@/components/plate-ui/editor'
import { FixedToolbar } from '@/components/plate-ui/fixed-toolbar'
import { FixedToolbarButtons } from '@/components/plate-ui/fixed-toolbar-buttons'
import FloatingLaserResponse from '@/components/plate-ui/floating-laser-response'
import FloatingPrompt from '@/components/plate-ui/floating-prompt'
import { FloatingToolbar } from '@/components/plate-ui/floating-toolbar'
import { FloatingToolbarButtons } from '@/components/plate-ui/floating-toolbar-buttons'
import { HeadingElement } from '@/components/plate-ui/heading-element'
import { HighlightLeaf } from '@/components/plate-ui/highlight-leaf'
import { HrElement } from '@/components/plate-ui/hr-element'
import {
	TodoLi,
	TodoMarker,
} from '@/components/plate-ui/indent-todo-marker-component'
import { KbdLeaf } from '@/components/plate-ui/kbd-leaf'
import { LaserLeaf } from '@/components/plate-ui/laser-leaf'
import LaserPromptLeaf from '@/components/plate-ui/laser-prompt-leaf'
import { ParagraphElement } from '@/components/plate-ui/paragraph-element'
import { withPlaceholders } from '@/components/plate-ui/placeholder'
import { SearchHighlightLeaf } from '@/components/plate-ui/search-highlight-leaf'
import SuggestionLeaf from '@/components/plate-ui/suggestion-leaf'
import { useEpisodeContext } from '@/providers/episode-id-provider'
import { autoformatRules } from '@/lib/plate/autoformat-rules'
import { FindReplacePlugin } from '@/lib/plate/plugins/find-replace'
import { LaserPlugin, PromptPlugin } from '@/lib/plate/plugins/laser-plugin'
import { getRecord, jsonify } from '@/lib/utils'

import SaveEpisode from './save-episode'
import Sidebar from './sidebar'
import SyncMetaData from './sync-metadata'
import Versions from './versions'

export default function PlateEditor() {
	const { selectedStatus, setSelectedStatus } = useEpisodeContext()
	const queryClient = useQueryClient()
	const containerRef = useRef<HTMLDivElement>(null)
	const { data: content, latestStatus, queryKey } = useEpisodeContent()
	const isChildEpisode = !!content?.chapter.is_deleted
	const editor = useMyEditor({
		content: content?.text || '',
		comments: content?.chapter.props?.comments,
	})

	const { extended } = extendStore()

	useEffect(() => {
		const invalidate = async () => {
			await queryClient.invalidateQueries({ queryKey })
		}
		void invalidate()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [extended])

	if (!content || !latestStatus)
		return (
			<div className="flex min-h-[80vh] flex-1 items-center justify-center">
				<Loader />
			</div>
		)

	return (
		<Plate editor={editor}>
			<ChatbotProvider>
				<div className="flex animate-fade-in-up items-center justify-between">
					<Title />
					<div className="flex items-center gap-2">
						<Versions
							{...{
								isChildEpisode,
								latestStatus,
								selectedStatus,
								setSelectedStatus,
							}}
						/>
						<SyncMetaData />
						<SaveEpisode />
					</div>
				</div>
				<div
					ref={containerRef}
					className={cn(
						'relative mt-4 animate-fade-in-up rounded border bg-background-editor shadow-editor',
						// Block selection
						'[&_.slate-start-area-left]:!w-[64px] [&_.slate-start-area-right]:!w-[64px] [&_.slate-start-area-top]:!h-4'
					)}
				>
					<FixedToolbar>
						<FixedToolbarButtons />
					</FixedToolbar>
					<div className="~h-[78vh] flex size-full">
						<div className="w-full flex-1 bg-background">
							<div className="flex h-full">
								<div className="flex w-full">
									<Editor
										className="size-full rounded-none px-12 py-5"
										autoFocus
										focusRing={false}
										variant="ghost"
										size="md"
									/>

									<FloatingToolbar>
										<FloatingToolbarButtons />
									</FloatingToolbar>

									<CursorOverlay containerRef={containerRef} />
								</div>
								<Translation translatedContent={content.translation_text} />
							</div>
							{/* <ScrollBar orientation="horizontal" /> */}
						</div>
						<Sidebar />
					</div>
				</div>
				<FloatingPrompt />
				<FloatingLaserResponse />
			</ChatbotProvider>
		</Plate>
	)
}

export const useMyEditor = ({
	content,
	id,
	comments,
}: {
	comments?: TComment[]
	content: string
	id?: string
}) => {
	const userData = useGlobalStore(useShallow((state) => state.userData))
	const initialValue = jsonify(content)

	const editor = createPlateEditor({
		plugins: [
			LaserPlugin,
			PromptPlugin,
			FindReplacePlugin,
			HeadingPlugin,
			HorizontalRulePlugin,

			// Marks
			BoldPlugin,
			ItalicPlugin,
			UnderlinePlugin,
			StrikethroughPlugin,
			FontColorPlugin,
			FontBackgroundColorPlugin,
			HighlightPlugin,
			KbdPlugin,

			// Block Style
			AlignPlugin.configure({
				inject: {
					targetPlugins: [ParagraphPlugin.key, ...HEADING_LEVELS],
				},
			}),
			IndentPlugin.configure({
				inject: {
					targetPlugins: [
						ParagraphPlugin.key,
						BlockquotePlugin.key,
						CodeBlockPlugin.key,
						...HEADING_LEVELS,
					],
				},
			}),
			IndentListPlugin.configure({
				inject: {
					targetPlugins: [
						ParagraphPlugin.key,
						BlockquotePlugin.key,
						CodeBlockPlugin.key,
						...HEADING_LEVELS,
					],
				},
				options: {
					listStyleTypes: {
						todo: {
							liComponent: TodoLi,
							markerComponent: TodoMarker,
							type: 'todo',
						},
					},
				},
			}),
			LineHeightPlugin.configure({
				inject: {
					nodeProps: {
						defaultNodeValue: 1.5,
						validNodeValues: [1, 1.2, 1.5, 2, 3],
					},
					targetPlugins: [ParagraphPlugin.key, ...HEADING_LEVELS],
				},
			}),

			// Functionality
			AutoformatPlugin.configure({
				options: {
					rules: autoformatRules,
					enableUndoOnDelete: true,
				},
			}),
			ExitBreakPlugin.configure({
				options: {
					rules: [
						{
							hotkey: 'mod+enter',
						},
						{
							hotkey: 'mod+shift+enter',
							before: true,
						},
						{
							hotkey: 'enter',
							query: {
								start: true,
								end: true,
								allow: HEADING_LEVELS,
							},
							relative: true,
							level: 1,
						},
					],
				},
			}),
			NodeIdPlugin,
			ResetNodePlugin.configure({
				options: {
					rules: [
						{
							types: [BlockquotePlugin.key, TodoListPlugin.key],
							defaultType: ParagraphPlugin.key,
							hotkey: 'Enter',
							predicate: isBlockAboveEmpty,
						},
						{
							types: [BlockquotePlugin.key, TodoListPlugin.key],
							defaultType: ParagraphPlugin.key,
							hotkey: 'Backspace',
							predicate: isSelectionAtBlockStart,
						},
						{
							types: [CodeBlockPlugin.key],
							defaultType: ParagraphPlugin.key,
							onReset: unwrapCodeBlock,
							hotkey: 'Enter',
							predicate: isCodeBlockEmpty,
						},
						{
							types: [CodeBlockPlugin.key],
							defaultType: ParagraphPlugin.key,
							onReset: unwrapCodeBlock,
							hotkey: 'Backspace',
							predicate: isSelectionAtCodeBlockStart,
						},
					],
				},
			}),
			SelectOnBackspacePlugin.configure({
				options: {
					query: {
						allow: [ImagePlugin.key, HorizontalRulePlugin.key],
					},
				},
			}),
			SoftBreakPlugin.configure({
				options: {
					rules: [
						{ hotkey: 'enter' },
						{
							hotkey: 'enter',
							query: {
								allow: [
									CodeBlockPlugin.key,
									BlockquotePlugin.key,
									TableCellPlugin.key,
									TableCellHeaderPlugin.key,
								],
							},
						},
					],
				},
			}),
			TrailingBlockPlugin.configure({
				options: { type: ParagraphPlugin.key },
			}),
			DragOverCursorPlugin,

			// Collaboration
			CommentsPlugin.configure({
				options: {
					users: {
						1: {
							id: '1',
							name: userData?.user?.name || 'User',
							avatarUrl: userData?.user?.image || '/placeholder-user.webp',
						},
						[AI_USER_ID]: {
							id: AI_USER_ID,
							name: 'Copilot AI',
							avatarUrl: '/pocket-copilot-logo.webp',
						},
					},
					comments: getRecord(comments),
					myUserId: '1',
				},
			}),
			SuggestionPlugin.configure({
				options: {
					users: {
						1: {
							id: '1',
							name: userData?.user?.name || 'User',
							avatarUrl: userData?.user?.image || '/placeholder-user.webp',
						},
					},
					currentUserId: '1',
				},
			}),

			// Deserialization
			DocxPlugin,
			MarkdownPlugin,
			JuicePlugin,
			HtmlReactPlugin,
			HtmlPlugin,
		],
		override: {
			components: withPlaceholders({
				[LaserPlugin.key]: LaserLeaf,
				[FindReplacePlugin.key]: SearchHighlightLeaf,
				[HorizontalRulePlugin.key]: HrElement,
				[HEADING_KEYS.h1]: withProps(HeadingElement, { variant: 'h1' }),
				[HEADING_KEYS.h2]: withProps(HeadingElement, { variant: 'h2' }),
				[HEADING_KEYS.h3]: withProps(HeadingElement, { variant: 'h3' }),
				[HEADING_KEYS.h4]: withProps(HeadingElement, { variant: 'h4' }),
				[HEADING_KEYS.h5]: withProps(HeadingElement, { variant: 'h5' }),
				[HEADING_KEYS.h6]: withProps(HeadingElement, { variant: 'h6' }),
				[ParagraphPlugin.key]: ParagraphElement,
				[BoldPlugin.key]: withProps(PlateLeaf, { as: 'strong' }),
				[HighlightPlugin.key]: HighlightLeaf,
				[ItalicPlugin.key]: withProps(PlateLeaf, { as: 'em' }),
				[KbdPlugin.key]: KbdLeaf,
				[StrikethroughPlugin.key]: withProps(PlateLeaf, { as: 's' }),
				[UnderlinePlugin.key]: withProps(PlateLeaf, { as: 'u' }),
				[CommentsPlugin.key]: CommentLeaf,
				[SuggestionPlugin.key]: SuggestionLeaf,
				[PromptPlugin.key]: LaserPromptLeaf,
			}),
		},
		value:
			typeof initialValue === 'string'
				? [
						{
							id: `0`,
							type: ParagraphPlugin.key,
							children: [{ text: initialValue }],
						},
					]
				: initialValue,
		...(id ? { id } : {}),
	})

	return editor
}

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
'use client'

import { AI_USER_ID } from '@/constants/ai-constants'
import {
	COPILOT_LOGO_URL,
	FALLBACK_USER_URL,
} from '@/constants/global-constants'
import { useGlobalStore } from '@/store/global-store'
import { withProps } from '@udecode/cn'
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
import { TrailingBlockPlugin } from '@udecode/plate-trailing-block'
import { useShallow } from 'zustand/react/shallow'

import { BlockquoteElement } from '@/components/plate-ui/block-quote-element'
import { CommentLeaf } from '@/components/plate-ui/comment-leaf'
import { DragOverCursorPlugin } from '@/components/plate-ui/cursor-overlay'
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
import { autoformatRules } from '@/lib/plate/autoformat-rules'
import { FindReplacePlugin } from '@/lib/plate/plugins/find-replace'
import { LaserPlugin, PromptPlugin } from '@/lib/plate/plugins/laser-plugin'
import { breakDownValue, getRecord, jsonify } from '@/lib/utils/plate'

const extraPlugins = [
	LaserPlugin,
	PromptPlugin,
	FindReplacePlugin,
	HeadingPlugin,
	HorizontalRulePlugin,
]
const extraPluginComponents = {
	[LaserPlugin.key]: LaserLeaf,
	[FindReplacePlugin.key]: SearchHighlightLeaf,
	[PromptPlugin.key]: LaserPromptLeaf,
	[CommentsPlugin.key]: CommentLeaf,
	[SuggestionPlugin.key]: SuggestionLeaf,
}
const useMyEditor = ({
	content,
	id,
	comments,
	simplified,
}: {
	comments?: TComment[]
	content: string
	id?: string
	simplified?: boolean
}) => {
	const userData = useGlobalStore(useShallow((state) => state.userData))
	const initialValue = jsonify(content)
	const value = breakDownValue(initialValue)
	const editor = createPlateEditor({
		plugins: [
			...(simplified ? [] : extraPlugins),
			// Marks
			BoldPlugin,
			ItalicPlugin,
			UnderlinePlugin,
			StrikethroughPlugin,
			FontColorPlugin,
			FontBackgroundColorPlugin,
			HighlightPlugin,
			KbdPlugin,
			BlockquotePlugin,
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
						...HEADING_LEVELS,
					],
				},
			}),
			IndentListPlugin.configure({
				inject: {
					targetPlugins: [
						ParagraphPlugin.key,
						BlockquotePlugin.key,
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
			SoftBreakPlugin,
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
							avatarUrl: userData?.user?.image || FALLBACK_USER_URL,
						},
						[AI_USER_ID]: {
							id: AI_USER_ID,
							name: 'Copilot AI',
							avatarUrl: COPILOT_LOGO_URL,
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
							avatarUrl: userData?.user?.image || FALLBACK_USER_URL,
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
				...(simplified ? {} : extraPluginComponents),
				[HorizontalRulePlugin.key]: HrElement,
				[HEADING_KEYS.h1]: withProps(HeadingElement, { variant: 'h1' }),
				[HEADING_KEYS.h2]: withProps(HeadingElement, { variant: 'h2' }),
				[HEADING_KEYS.h3]: withProps(HeadingElement, { variant: 'h3' }),
				[HEADING_KEYS.h4]: withProps(HeadingElement, { variant: 'h4' }),
				[HEADING_KEYS.h5]: withProps(HeadingElement, { variant: 'h5' }),
				[HEADING_KEYS.h6]: withProps(HeadingElement, { variant: 'h6' }),
				[BlockquotePlugin.key]: BlockquoteElement,
				[ParagraphPlugin.key]: ParagraphElement,
				[BoldPlugin.key]: withProps(PlateLeaf, { as: 'strong' }),
				[HighlightPlugin.key]: HighlightLeaf,
				[ItalicPlugin.key]: withProps(PlateLeaf, { as: 'em' }),
				[KbdPlugin.key]: KbdLeaf,
				[StrikethroughPlugin.key]: withProps(PlateLeaf, { as: 's' }),
				[UnderlinePlugin.key]: withProps(PlateLeaf, { as: 'u' }),
			}),
		},
		value,
		...(id ? { id } : {}),
	})

	return editor
}

export default useMyEditor

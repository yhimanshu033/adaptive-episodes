/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
'use client'

import { useMemo } from 'react'
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
// Memoize static plugin configurations
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
import { ListElement } from '@/components/plate-ui/list-element'
import { ParagraphElement } from '@/components/plate-ui/paragraph-element'
import { withPlaceholders } from '@/components/plate-ui/placeholder'
import { ResolvedCommentLeaf } from '@/components/plate-ui/resolved-comment-leaf'
import { SearchHighlightLeaf } from '@/components/plate-ui/search-highlight-leaf'
import SuggestionLeaf from '@/components/plate-ui/suggestion-leaf'
import useProjectId from '@/providers/project-id-provider'
import { autoformatRules } from '@/lib/plate/autoformat-rules'
import { FindReplacePlugin } from '@/lib/plate/plugins/find-replace'
import { LaserPlugin, PromptPlugin } from '@/lib/plate/plugins/laser-plugin'
import { ResolvedCommentsPlugin } from '@/lib/plate/plugins/resolved-comments'
import { breakDownValue, getRecord, jsonify } from '@/lib/utils/plate'

import { TCustomComment } from '@/types/editor-types'

const extraPlugins = [
	LaserPlugin,
	PromptPlugin,
	FindReplacePlugin,
	HeadingPlugin,
	HorizontalRulePlugin,
	ResolvedCommentsPlugin,
]

const extraPluginComponents = {
	[LaserPlugin.key]: LaserLeaf,
	[FindReplacePlugin.key]: SearchHighlightLeaf,
	[PromptPlugin.key]: LaserPromptLeaf,
	[CommentsPlugin.key]: CommentLeaf,
	[SuggestionPlugin.key]: SuggestionLeaf,
	[ResolvedCommentsPlugin.key]: ResolvedCommentLeaf,
}

const createBaseComponents = () =>
	withPlaceholders({
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
	})

// Memoize static plugin configurations
const createStaticPlugins = () => [
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
	BlockquotePlugin,
	AlignPlugin.configure({
		inject: {
			targetPlugins: [ParagraphPlugin.key, ...HEADING_LEVELS],
		},
	}),
	IndentPlugin.configure({
		inject: {
			nodeProps: {
				styleKey: 'paddingLeft',
			},
		},
		options: {
			offset: 48,
			unit: 'px',
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
		render: {
			node: withProps(ListElement, { variant: 'ul' }),
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
	// Deserialization
	DocxPlugin,
	MarkdownPlugin,
	JuicePlugin,
	HtmlReactPlugin,
	HtmlPlugin,
]

// Cache static configurations
const staticPlugins = createStaticPlugins()
const baseComponents = createBaseComponents()

const useMyEditor = ({
	content,
	id,
	comments,
	simplified,
	resolvedComments,
}: {
	comments?: TComment[]
	content: string
	id?: string
	resolvedComments?: TCustomComment[]
	simplified?: boolean
}) => {
	const {
		users,
		me: { user: userData },
	} = useProjectId()

	// Memoize processed content
	const processedValue = useMemo(() => {
		const initialValue = jsonify(content)
		return breakDownValue(initialValue)
	}, [content])

	// Memoize collaboration plugins that depend on dynamic data
	const collaborationPlugins = useMemo(
		() => [
			CommentsPlugin.configure({
				options: {
					users,
					comments: getRecord(comments),
					myUserId: String(userData?.user?.id),
				},
			}),
			ResolvedCommentsPlugin.configure({
				options: {
					resolvedComments,
				},
			}),
			SuggestionPlugin.configure({
				options: {
					users,
					currentUserId: String(userData?.user?.id),
				},
			}),
		],
		[users, comments, userData?.user?.id, resolvedComments]
	)

	// Memoize final plugins array
	const plugins = useMemo(
		() => [
			...(simplified ? [] : extraPlugins),
			...staticPlugins,
			...collaborationPlugins,
		],
		[simplified, collaborationPlugins]
	)

	// Memoize components
	const components = useMemo(
		() => ({
			...(simplified
				? baseComponents
				: { ...baseComponents, ...extraPluginComponents }),
		}),
		[simplified]
	)

	// Memoize editor configuration
	const editorConfig = useMemo(
		() => ({
			plugins,
			override: {
				components,
			},
			value: processedValue,
			...(id ? { id } : {}),
		}),
		[plugins, components, processedValue, id]
	)

	// Create editor with memoized config
	const editor = useMemo(() => createPlateEditor(editorConfig), [editorConfig])

	return editor
}

export default useMyEditor

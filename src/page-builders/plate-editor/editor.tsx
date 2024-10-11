/* eslint-disable @typescript-eslint/no-unsafe-assignment */
'use client'

import React, { useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import useEpisodeContent from '@/hooks/query/use-episode-content'
import Title from '@/page-builders/editor/title'
import Translation from '@/page-builders/plate-editor/translation'
import { cn, withProps } from '@udecode/cn'
import { AlignPlugin } from '@udecode/plate-alignment/react'
import { AutoformatPlugin } from '@udecode/plate-autoformat/react'
import {
	BoldPlugin,
	CodePlugin,
	ItalicPlugin,
	StrikethroughPlugin,
	SubscriptPlugin,
	SuperscriptPlugin,
	UnderlinePlugin,
} from '@udecode/plate-basic-marks/react'
import { BlockquotePlugin } from '@udecode/plate-block-quote/react'
import { ExitBreakPlugin, SoftBreakPlugin } from '@udecode/plate-break/react'
import { CaptionPlugin } from '@udecode/plate-caption/react'
import {
	isCodeBlockEmpty,
	isSelectionAtCodeBlockStart,
	unwrapCodeBlock,
} from '@udecode/plate-code-block'
import {
	CodeBlockPlugin,
	CodeLinePlugin,
	CodeSyntaxPlugin,
} from '@udecode/plate-code-block/react'
import { CommentsPlugin } from '@udecode/plate-comments/react'
import {
	HtmlPlugin,
	isBlockAboveEmpty,
	isSelectionAtBlockStart,
	someNode,
} from '@udecode/plate-common'
import {
	createPlateEditor,
	ParagraphPlugin,
	Plate,
	PlateLeaf,
} from '@udecode/plate-common/react'
import { DndPlugin } from '@udecode/plate-dnd'
import { DocxPlugin } from '@udecode/plate-docx'
import { EmojiPlugin } from '@udecode/plate-emoji/react'
import { ExcalidrawPlugin } from '@udecode/plate-excalidraw/react'
import {
	FontBackgroundColorPlugin,
	FontColorPlugin,
	FontFamilyPlugin,
	FontSizePlugin,
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
import { LinkPlugin } from '@udecode/plate-link/react'
import { TodoListPlugin } from '@udecode/plate-list/react'
import { MarkdownPlugin } from '@udecode/plate-markdown'
import { ImagePlugin, MediaEmbedPlugin } from '@udecode/plate-media/react'
import { MentionInputPlugin, MentionPlugin } from '@udecode/plate-mention/react'
import { NodeIdPlugin } from '@udecode/plate-node-id'
import { ResetNodePlugin } from '@udecode/plate-reset-node/react'
import { SelectOnBackspacePlugin } from '@udecode/plate-select'
import { BlockSelectionPlugin } from '@udecode/plate-selection/react'
import { TabbablePlugin } from '@udecode/plate-tabbable/react'
import {
	TableCellHeaderPlugin,
	TableCellPlugin,
	TablePlugin,
	TableRowPlugin,
} from '@udecode/plate-table/react'
import { TrailingBlockPlugin } from '@udecode/plate-trailing-block'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

import { BlockquoteElement } from '@/components/plate-ui/blockquote-element'
import { CodeBlockElement } from '@/components/plate-ui/code-block-element'
import { CodeLeaf } from '@/components/plate-ui/code-leaf'
import { CodeLineElement } from '@/components/plate-ui/code-line-element'
import { CodeSyntaxLeaf } from '@/components/plate-ui/code-syntax-leaf'
import { CommentLeaf } from '@/components/plate-ui/comment-leaf'
import {
	CursorOverlay,
	DragOverCursorPlugin,
} from '@/components/plate-ui/cursor-overlay'
import { Editor } from '@/components/plate-ui/editor'
import { ExcalidrawElement } from '@/components/plate-ui/excalidraw-element'
import { FixedToolbar } from '@/components/plate-ui/fixed-toolbar'
import { FixedToolbarButtons } from '@/components/plate-ui/fixed-toolbar-buttons'
import { FloatingToolbar } from '@/components/plate-ui/floating-toolbar'
import { FloatingToolbarButtons } from '@/components/plate-ui/floating-toolbar-buttons'
import { HeadingElement } from '@/components/plate-ui/heading-element'
import { HighlightLeaf } from '@/components/plate-ui/highlight-leaf'
import { HrElement } from '@/components/plate-ui/hr-element'
import { ImageElement } from '@/components/plate-ui/image-element'
import {
	TodoLi,
	TodoMarker,
} from '@/components/plate-ui/indent-todo-marker-component'
import { KbdLeaf } from '@/components/plate-ui/kbd-leaf'
import { LinkElement } from '@/components/plate-ui/link-element'
import { LinkFloatingToolbar } from '@/components/plate-ui/link-floating-toolbar'
import { MediaEmbedElement } from '@/components/plate-ui/media-embed-element'
import { MentionElement } from '@/components/plate-ui/mention-element'
import { MentionInputElement } from '@/components/plate-ui/mention-input-element'
import { ParagraphElement } from '@/components/plate-ui/paragraph-element'
import { withPlaceholders } from '@/components/plate-ui/placeholder'
import {
	TableCellElement,
	TableCellHeaderElement,
} from '@/components/plate-ui/table-cell-element'
import { TableElement } from '@/components/plate-ui/table-element'
import { TableRowElement } from '@/components/plate-ui/table-row-element'
import { TodoListElement } from '@/components/plate-ui/todo-list-element'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
// import { withDraggables } from '@/components/plate-ui/with-draggables'
import { autoformatRules } from '@/lib/plate/autoformat-rules'

import Sidebar from './sidebar'

export default function PlateEditor() {
	const containerRef = useRef(null)
	const { data: content, isLoading } = useEpisodeContent()
	const router = useRouter()
	const { id } = useParams()

	const editor = useMyEditor({ content: content?.de })

	const handleEpisodeChange = (episode: number) => {
		router.push(
			`${process.env.NEXT_PUBLIC_BASE_URL}/projects/${id as string}/${episode}/editor`
		)
	}

	return (
		<DndProvider backend={HTML5Backend}>
			<div className="flex items-center justify-between">
				<Title title={content?.episode_name as string} />
				{!isLoading && (
					<div className="flex gap-2">
						<Button
							variant="outline"
							disabled={!content?.hasPrevious}
							onClick={() => handleEpisodeChange((content?.episode ?? 0) - 1)}
						>
							<ArrowLeft className="mr-2 inline" />
							Previous Episode
						</Button>
						<Button
							disabled={!content?.hasNext}
							onClick={() => handleEpisodeChange((content?.episode ?? 0) + 1)}
						>
							Next Episode <ArrowRight className="ml-2 inline" />
						</Button>
					</div>
				)}
			</div>
			<Plate editor={editor}>
				<div
					ref={containerRef}
					className={cn(
						'relative mt-4 min-h-[60vh] rounded border bg-background-editor shadow-editor',
						// Block selection
						'[&_.slate-start-area-left]:!w-[64px] [&_.slate-start-area-right]:!w-[64px] [&_.slate-start-area-top]:!h-4'
					)}
				>
					<FixedToolbar>
						<FixedToolbarButtons />
					</FixedToolbar>
					<div className="flex h-[60vh] w-full">
						<ScrollArea className="w-full flex-1">
							<div className="flex h-full">
								<div className="flex w-full border-r">
									<Editor
										className="size-full px-12 py-5"
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
								<Translation
									translatedContent={
										isLoading
											? 'Translation Loading...'
											: (content?.us as string)
									}
								/>
							</div>
						</ScrollArea>
						<Sidebar />
					</div>
				</div>
			</Plate>
		</DndProvider>
	)
}

export const useMyEditor = ({
	content,
	id,
}: {
	content?: string
	id?: string
}) => {
	const { data: userData } = useSession()
	const editor = createPlateEditor({
		plugins: [
			// Nodes
			HeadingPlugin,
			BlockquotePlugin,
			CodeBlockPlugin,
			CodeLinePlugin,
			CodeSyntaxPlugin,
			HorizontalRulePlugin,
			LinkPlugin.configure({
				render: { afterEditable: () => <LinkFloatingToolbar /> },
			}),
			ImagePlugin,
			MediaEmbedPlugin,
			CaptionPlugin.configure({
				options: { plugins: [ImagePlugin, MediaEmbedPlugin] },
			}),
			MentionPlugin,
			MentionInputPlugin,
			TablePlugin,
			TableRowPlugin,
			TableCellPlugin,
			TableCellHeaderPlugin,
			TodoListPlugin,
			ExcalidrawPlugin,

			// Marks
			BoldPlugin,
			ItalicPlugin,
			UnderlinePlugin,
			StrikethroughPlugin,
			CodePlugin,
			SubscriptPlugin,
			SuperscriptPlugin,
			FontColorPlugin,
			FontBackgroundColorPlugin,
			FontSizePlugin,
			FontFamilyPlugin,
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
			BlockSelectionPlugin,
			DndPlugin.configure({
				options: { enableScroller: true },
			}),
			EmojiPlugin,
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
						{ hotkey: 'shift+enter' },
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
			TabbablePlugin.configure(({ editor }) => ({
				options: {
					query: () => {
						if (isSelectionAtBlockStart(editor)) return false

						return !someNode(editor, {
							match: (n) => {
								return !!(
									n.type &&
									([
										TablePlugin.key,
										TodoListPlugin.key,
										CodeBlockPlugin.key,
									].includes(n.type as string) ||
										n.listStyleType)
								)
							},
						})
					},
				},
			})),
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
							avatarUrl: userData?.user?.image || '/placeholder-user.jpg',
						},
					},
					myUserId: '1',
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
			components:
				// withDraggables(
				withPlaceholders({
					[BlockquotePlugin.key]: BlockquoteElement,
					[CodeBlockPlugin.key]: CodeBlockElement,
					[CodeLinePlugin.key]: CodeLineElement,
					[CodeSyntaxPlugin.key]: CodeSyntaxLeaf,
					[HorizontalRulePlugin.key]: HrElement,
					[HEADING_KEYS.h1]: withProps(HeadingElement, { variant: 'h1' }),
					[HEADING_KEYS.h2]: withProps(HeadingElement, { variant: 'h2' }),
					[HEADING_KEYS.h3]: withProps(HeadingElement, { variant: 'h3' }),
					[HEADING_KEYS.h4]: withProps(HeadingElement, { variant: 'h4' }),
					[HEADING_KEYS.h5]: withProps(HeadingElement, { variant: 'h5' }),
					[HEADING_KEYS.h6]: withProps(HeadingElement, { variant: 'h6' }),
					[ImagePlugin.key]: ImageElement,
					[LinkPlugin.key]: LinkElement,
					[MediaEmbedPlugin.key]: MediaEmbedElement,
					[MentionPlugin.key]: MentionElement,
					[MentionInputPlugin.key]: MentionInputElement,
					[ParagraphPlugin.key]: ParagraphElement,
					[TablePlugin.key]: TableElement,
					[TableRowPlugin.key]: TableRowElement,
					[TableCellPlugin.key]: TableCellElement,
					[TableCellHeaderPlugin.key]: TableCellHeaderElement,
					[TodoListPlugin.key]: TodoListElement,
					[ExcalidrawPlugin.key]: ExcalidrawElement,
					[BoldPlugin.key]: withProps(PlateLeaf, { as: 'strong' }),
					[CodePlugin.key]: CodeLeaf,
					[HighlightPlugin.key]: HighlightLeaf,
					[ItalicPlugin.key]: withProps(PlateLeaf, { as: 'em' }),
					[KbdPlugin.key]: KbdLeaf,
					[StrikethroughPlugin.key]: withProps(PlateLeaf, { as: 's' }),
					[SubscriptPlugin.key]: withProps(PlateLeaf, { as: 'sub' }),
					[SuperscriptPlugin.key]: withProps(PlateLeaf, { as: 'sup' }),
					[UnderlinePlugin.key]: withProps(PlateLeaf, { as: 'u' }),
					[CommentsPlugin.key]: CommentLeaf,
				}),
			// ),
		},
		value: !content
			? [
					{
						id: '1',
						type: ParagraphPlugin.key,
						children: [{ text: 'Loading...' }],
					},
				]
			: content.split('\n').map((text, index) => ({
					id: `${index}`,
					type: ParagraphPlugin.key,
					children: [{ text }],
				})),
		...(id ? { id } : {}),
	})

	return editor
}

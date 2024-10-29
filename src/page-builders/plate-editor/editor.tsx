/* eslint-disable @typescript-eslint/no-unsafe-assignment */
'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import useEpisodeHook from '@/hooks/mutation/use-episode-hook'
import useEpisodeContent from '@/hooks/query/use-episode-content'
import Title from '@/page-builders/plate-editor/title'
import Translation from '@/page-builders/plate-editor/translation'
import { useGlobalStore } from '@/store/global-store'
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
import { CommentsPlugin } from '@udecode/plate-comments/react'
import {
	HtmlPlugin,
	isBlockAboveEmpty,
	isSelectionAtBlockStart,
	Value,
} from '@udecode/plate-common'
import {
	createPlateEditor,
	ParagraphPlugin,
	Plate,
	PlateLeaf,
} from '@udecode/plate-common/react'
import { DndPlugin } from '@udecode/plate-dnd'
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
import { BlockSelectionPlugin } from '@udecode/plate-selection/react'
import {
	TableCellHeaderPlugin,
	TableCellPlugin,
} from '@udecode/plate-table/react'
import { TrailingBlockPlugin } from '@udecode/plate-trailing-block'
import {
	CircleArrowLeft,
	CircleArrowRight,
	LoaderCircle,
	Save,
	SeparatorHorizontal,
} from 'lucide-react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
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
import { ParagraphElement } from '@/components/plate-ui/paragraph-element'
import { withPlaceholders } from '@/components/plate-ui/placeholder'
import { Button, buttonVariants } from '@/components/ui/button'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
// import { withDraggables } from '@/components/plate-ui/with-draggables'
import { autoformatRules } from '@/lib/plate/autoformat-rules'
import { valueToText } from '@/lib/plate/value-to-text'

import Sidebar from './sidebar'
import Versions from './versions'

export default function PlateEditor() {
	const containerRef = useRef(null)
	const { data: content, isLoading } = useEpisodeContent()
	const savedContent = useRef<Value>([])
	const [episodeContent, setEpisodeContent] = useState<Value>([])

	const router = useRouter()
	const { id } = useParams()

	const editor = useMyEditor({ episodeContent })

	const { saveEpisodeMutation } = useEpisodeHook()

	const handleEpisodeChange = (episode: string | null) => {
		if (!episode) return
		router.push(
			`${process.env.NEXT_PUBLIC_BASE_URL}/projects/${id as string}/${episode}/editor`
		)
	}

	const handleSave = useCallback(() => {
		if (savedContent.current === episodeContent) return
		setEpisodeContent(savedContent.current)
		saveEpisodeMutation.mutate(valueToText(savedContent.current))
	}, [episodeContent, saveEpisodeMutation])

	useEffect(() => {
		if (content?.de) {
			const value = content.de.split('\n').map((text, index) => ({
				id: `${index}`,
				type: ParagraphPlugin.key,
				children: [{ text }],
			}))

			setEpisodeContent(value)
			savedContent.current = value
		}
	}, [content?.de])

	useEffect(() => {
		const intervalId = setInterval(handleSave, 30 * 1000)

		return () => {
			clearInterval(intervalId)
		}
	}, [handleSave])

	if (!content)
		return (
			<div className="flex flex-1 items-center justify-center">
				<Loader />
			</div>
		)
	return (
		<DndProvider backend={HTML5Backend}>
			<div className="flex items-center justify-between">
				<Title
					title={content?.title.de}
					episodeNumber={content?.episodeNumber}
				/>
				<div className="flex items-center gap-2">
					<Versions activeVersionId={content.activeVersionId} />
					{!isLoading && (
						<div className="flex gap-2">
							{saveEpisodeMutation.isPending ? (
								<div
									className={cn(
										buttonVariants({ variant: 'ghost', size: 'icon' })
									)}
								>
									<LoaderCircle className="animate-spin" size={16} />
								</div>
							) : (
								<Button size="icon" onClick={handleSave}>
									<Save size={16} />
								</Button>
							)}
						</div>
					)}
				</div>
			</div>
			<Plate
				editor={editor}
				onChange={(data) => {
					savedContent.current = data.value
				}}
			>
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
					<div className="flex h-[58vh] w-full">
						<ScrollArea className="w-full flex-1">
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
								<Translation
									translatedContent={
										isLoading ? 'Translation Loading...' : content.us
									}
								/>
							</div>
							<ScrollBar orientation="horizontal" />
						</ScrollArea>
						<Sidebar />
					</div>
				</div>
			</Plate>
			<div className="mt-5 flex items-center justify-center gap-2">
				<Button
					variant="outline"
					size="icon"
					className="rounded-full"
					disabled={!content?.previousEpisodeId}
					onClick={() => handleEpisodeChange(content?.previousEpisodeId)}
				>
					<CircleArrowLeft />
				</Button>
				<Button
					disabled={!content?.nextEpisodeId}
					className="rounded-full"
					size="icon"
					onClick={() => handleEpisodeChange(content?.nextEpisodeId)}
				>
					<CircleArrowRight />
				</Button>
				<Button size="icon" variant="ghost">
					<SeparatorHorizontal />
				</Button>
			</div>
		</DndProvider>
	)
}

export const useMyEditor = ({
	episodeContent,
}: {
	episodeContent?: Value
	id?: string
}) => {
	const userData = useGlobalStore(useShallow((state) => state.userData))
	const editor = createPlateEditor({
		plugins: [
			// Nodes
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
			BlockSelectionPlugin,
			DndPlugin.configure({
				options: { enableScroller: true },
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
				}),
			// ),
		},
		value: episodeContent,
	})

	return editor
}

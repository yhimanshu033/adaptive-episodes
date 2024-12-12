'use client'

import {
	BoldPlugin,
	ItalicPlugin,
	StrikethroughPlugin,
	UnderlinePlugin,
} from '@udecode/plate-basic-marks/react'
import { BlockquotePlugin } from '@udecode/plate-block-quote/react'
import { ExitBreakPlugin, SoftBreakPlugin } from '@udecode/plate-break/react'
import { ParagraphPlugin } from '@udecode/plate-common/react'
import { DndPlugin } from '@udecode/plate-dnd'
import {
	FontBackgroundColorPlugin,
	FontColorPlugin,
	FontSizePlugin,
} from '@udecode/plate-font/react'
import { HEADING_LEVELS } from '@udecode/plate-heading'
import { HighlightPlugin } from '@udecode/plate-highlight/react'
import { HorizontalRulePlugin } from '@udecode/plate-horizontal-rule/react'
import { KbdPlugin } from '@udecode/plate-kbd/react'
import { ColumnPlugin } from '@udecode/plate-layout/react'
import { PlaceholderPlugin } from '@udecode/plate-media/react'
import { NodeIdPlugin } from '@udecode/plate-node-id'
import { BlockSelectionPlugin } from '@udecode/plate-selection/react'
import { TrailingBlockPlugin } from '@udecode/plate-trailing-block'

export const viewPlugins = [
	BoldPlugin,
	ItalicPlugin,
	UnderlinePlugin,
	StrikethroughPlugin,
	FontColorPlugin,
	FontBackgroundColorPlugin,
	HighlightPlugin,
	KbdPlugin,
	HorizontalRulePlugin,
	ColumnPlugin,
	BlockSelectionPlugin,

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

	SoftBreakPlugin.configure({
		options: {
			rules: [{ hotkey: 'enter' }],
		},
	}),

	// Marks
	FontColorPlugin,
	FontBackgroundColorPlugin,
	FontSizePlugin,
	HighlightPlugin,
	KbdPlugin,
	BlockquotePlugin,

	NodeIdPlugin,
	DndPlugin.configure({
		options: {
			enableScroller: true,
			onDropFiles: ({ dragItem, editor, target }) => {
				editor
					.getTransforms(PlaceholderPlugin)
					.insert.media(dragItem.files, { at: target, nextBlock: false })
			},
		},
	}),
] as const

export const editorPlugins = [
	// AI

	// Nodes
	...viewPlugins,

	// Functionality
	TrailingBlockPlugin.configure({ options: { type: ParagraphPlugin.key } }),
]

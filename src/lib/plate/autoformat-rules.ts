import {
	autoformatArrow,
	autoformatLegal,
	autoformatLegalHtml,
	autoformatMath,
	autoformatPunctuation,
	autoformatSmartQuotes,
} from '@udecode/plate-autoformat'
import type {
	AutoformatBlockRule,
	AutoformatRule,
} from '@udecode/plate-autoformat'
import {
	BoldPlugin,
	ItalicPlugin,
	StrikethroughPlugin,
	SubscriptPlugin,
	SuperscriptPlugin,
	UnderlinePlugin,
} from '@udecode/plate-basic-marks/react'
import { BlockquotePlugin } from '@udecode/plate-block-quote/react'
import {
	CodeBlockPlugin,
	CodeLinePlugin,
} from '@udecode/plate-code-block/react'
import {
	getParentNode,
	insertNodes,
	isElement,
	isType,
	setNodes,
} from '@udecode/plate-common'
import type { SlateEditor } from '@udecode/plate-common'
import { ParagraphPlugin } from '@udecode/plate-common/react'
import { HEADING_KEYS } from '@udecode/plate-heading'
import { HighlightPlugin } from '@udecode/plate-highlight/react'
import { HorizontalRulePlugin } from '@udecode/plate-horizontal-rule/react'
import { ListStyleType, toggleIndentList } from '@udecode/plate-indent-list'
import { toggleList, unwrapList } from '@udecode/plate-list'

export const preFormat: AutoformatBlockRule['preFormat'] = (editor) =>
	unwrapList(editor)

export const format = (editor: SlateEditor, customFormatting: () => void) => {
	if (editor.selection) {
		const parentEntry = getParentNode(editor, editor.selection)

		if (!parentEntry) {
			return
		}

		const [node] = parentEntry

		if (
			isElement(node) &&
			!isType(editor, node, CodeBlockPlugin.key) &&
			!isType(editor, node, CodeLinePlugin.key)
		) {
			customFormatting()
		}
	}
}

export const formatList = (editor: SlateEditor, elementType: string) => {
	format(editor, () =>
		toggleList(editor, {
			type: elementType,
		})
	)
}

export const autoformatMarks: AutoformatRule[] = [
	{
		match: '***',
		mode: 'mark',
		type: [BoldPlugin.key, ItalicPlugin.key],
	},
	{
		match: '__*',
		mode: 'mark',
		type: [UnderlinePlugin.key, ItalicPlugin.key],
	},
	{
		match: '__**',
		mode: 'mark',
		type: [UnderlinePlugin.key, BoldPlugin.key],
	},
	{
		match: '___***',
		mode: 'mark',
		type: [UnderlinePlugin.key, BoldPlugin.key, ItalicPlugin.key],
	},
	{
		match: '**',
		mode: 'mark',
		type: BoldPlugin.key,
	},
	{
		match: '__',
		mode: 'mark',
		type: UnderlinePlugin.key,
	},
	{
		match: '*',
		mode: 'mark',
		type: ItalicPlugin.key,
	},
	{
		match: '_',
		mode: 'mark',
		type: ItalicPlugin.key,
	},
	{
		match: '~~',
		mode: 'mark',
		type: StrikethroughPlugin.key,
	},
	{
		match: '^',
		mode: 'mark',
		type: SuperscriptPlugin.key,
	},
	{
		match: '~',
		mode: 'mark',
		type: SubscriptPlugin.key,
	},
	{
		match: '==',
		mode: 'mark',
		type: HighlightPlugin.key,
	},
	{
		match: '≡',
		mode: 'mark',
		type: HighlightPlugin.key,
	},
]

export const autoformatBlocks: AutoformatRule[] = [
	{
		match: '# ',
		mode: 'block',
		preFormat,
		type: HEADING_KEYS.h1,
	},
	{
		match: '## ',
		mode: 'block',
		preFormat,
		type: HEADING_KEYS.h2,
	},
	{
		match: '### ',
		mode: 'block',
		preFormat,
		type: HEADING_KEYS.h3,
	},
	{
		match: '#### ',
		mode: 'block',
		preFormat,
		type: HEADING_KEYS.h4,
	},
	{
		match: '##### ',
		mode: 'block',
		preFormat,
		type: HEADING_KEYS.h5,
	},
	{
		match: '###### ',
		mode: 'block',
		preFormat,
		type: HEADING_KEYS.h6,
	},
	{
		match: '> ',
		mode: 'block',
		preFormat,
		type: BlockquotePlugin.key,
	},
	{
		format: (editor) => {
			setNodes(editor, { type: HorizontalRulePlugin.key })
			insertNodes(editor, {
				children: [{ text: '' }],
				type: ParagraphPlugin.key,
			})
		},
		match: ['---', '—-', '___ '],
		mode: 'block',
		type: HorizontalRulePlugin.key,
	},
]

export const autoformatIndentLists: AutoformatRule[] = [
	{
		format: (editor) => {
			toggleIndentList(editor, {
				listStyleType: ListStyleType.Disc,
			})
		},
		match: ['* ', '- '],
		mode: 'block',
		type: 'list',
	},
	{
		format: (editor) =>
			toggleIndentList(editor, {
				listStyleType: ListStyleType.Decimal,
			}),
		match: ['^\\d+\\.$ ', '^\\d+\\)$ '],
		matchByRegex: true,
		mode: 'block',
		type: 'list',
	},
]

export const autoformatRules: AutoformatRule[] = [
	...autoformatBlocks,
	...autoformatMarks,
	...autoformatSmartQuotes,
	...autoformatPunctuation,
	...autoformatLegal,
	...autoformatLegalHtml,
	...autoformatArrow,
	...autoformatMath,
	...autoformatIndentLists,
]

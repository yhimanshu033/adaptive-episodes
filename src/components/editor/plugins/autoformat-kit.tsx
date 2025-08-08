'use client'

import type { AutoformatRule } from '@platejs/autoformat'
import {
	AutoformatPlugin,
	autoformatPunctuation,
	autoformatSmartQuotes,
} from '@platejs/autoformat'
import { KEYS } from 'platejs'

const autoformatMarks: AutoformatRule[] = [
	{
		match: '***',
		mode: 'mark',
		type: [KEYS.bold, KEYS.italic],
	},
	{
		match: '__*',
		mode: 'mark',
		type: [KEYS.underline, KEYS.italic],
	},
	{
		match: '__**',
		mode: 'mark',
		type: [KEYS.underline, KEYS.bold],
	},
	{
		match: '___***',
		mode: 'mark',
		type: [KEYS.underline, KEYS.bold, KEYS.italic],
	},
	{
		match: '**',
		mode: 'mark',
		type: KEYS.bold,
	},
	{
		match: '__',
		mode: 'mark',
		type: KEYS.underline,
	},
	{
		match: '*',
		mode: 'mark',
		type: KEYS.italic,
	},
	{
		match: '_',
		mode: 'mark',
		type: KEYS.italic,
	},
	{
		match: '~~',
		mode: 'mark',
		type: KEYS.strikethrough,
	},
	{
		match: '^',
		mode: 'mark',
		type: KEYS.sup,
	},
	{
		match: '~',
		mode: 'mark',
		type: KEYS.sub,
	},
	{
		match: '==',
		mode: 'mark',
		type: KEYS.highlight,
	},
	{
		match: '≡',
		mode: 'mark',
		type: KEYS.highlight,
	},
	{
		match: '`',
		mode: 'mark',
		type: KEYS.code,
	},
]

const autoformatBlocks: AutoformatRule[] = [
	{
		match: '# ',
		mode: 'block',
		type: KEYS.h1,
	},
	{
		match: '## ',
		mode: 'block',
		type: KEYS.h2,
	},
	{
		match: '### ',
		mode: 'block',
		type: KEYS.h3,
	},
	{
		match: '#### ',
		mode: 'block',
		type: KEYS.h4,
	},
	{
		match: '##### ',
		mode: 'block',
		type: KEYS.h5,
	},
	{
		match: '###### ',
		mode: 'block',
		type: KEYS.h6,
	},
	{
		match: '> ',
		mode: 'block',
		type: KEYS.blockquote,
	},
	{
		match: ['---', '—-', '___ '],
		mode: 'block',
		type: KEYS.hr,
		format: (editor) => {
			editor.tf.setNodes({ type: KEYS.hr })
			editor.tf.insertNodes({
				children: [{ text: '' }],
				type: KEYS.p,
			})
		},
	},
]

export const AutoformatKit = [
	AutoformatPlugin.configure({
		options: {
			enableUndoOnDelete: true,
			rules: [
				...autoformatBlocks,
				...autoformatMarks,
				...autoformatSmartQuotes,
				...autoformatPunctuation,
			].map(
				(rule): AutoformatRule => ({
					...rule,
					query: (editor) =>
						!editor.api.some({
							match: { type: editor.getType(KEYS.codeBlock) },
						}),
				})
			),
		},
	}),
]

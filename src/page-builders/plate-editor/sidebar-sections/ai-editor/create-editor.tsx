/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
'use client'

import { withProps } from '@udecode/cn'
import {
	BoldPlugin,
	ItalicPlugin,
	StrikethroughPlugin,
	SubscriptPlugin,
	SuperscriptPlugin,
	UnderlinePlugin,
} from '@udecode/plate-basic-marks/react'
import type { Value } from '@udecode/plate-common'
import {
	ParagraphPlugin,
	PlateLeaf,
	usePlateEditor,
	type CreatePlateEditorOptions,
} from '@udecode/plate-common/react'
import { HEADING_KEYS } from '@udecode/plate-heading'
import { HighlightPlugin } from '@udecode/plate-highlight/react'
import { HorizontalRulePlugin } from '@udecode/plate-horizontal-rule/react'
import { KbdPlugin } from '@udecode/plate-kbd/react'

import { HeadingElement } from '@/components/plate-ui/heading-element'
import { HighlightLeaf } from '@/components/plate-ui/highlight-leaf'
import { HrElement } from '@/components/plate-ui/hr-element'
import { KbdLeaf } from '@/components/plate-ui/kbd-leaf'
import { ParagraphElement } from '@/components/plate-ui/paragraph-element'
import { withPlaceholders } from '@/components/plate-ui/placeholder'
import { withDraggables } from '@/components/plate-ui/with-draggables'

import { editorPlugins, viewPlugins } from './editor-plugins'

export const viewComponents = {
	[BoldPlugin.key]: withProps(PlateLeaf, { as: 'strong' }),
	[HEADING_KEYS.h1]: withProps(HeadingElement, { variant: 'h1' }),
	[HEADING_KEYS.h2]: withProps(HeadingElement, { variant: 'h2' }),
	[HEADING_KEYS.h3]: withProps(HeadingElement, { variant: 'h3' }),
	[HEADING_KEYS.h4]: withProps(HeadingElement, { variant: 'h4' }),
	[HEADING_KEYS.h5]: withProps(HeadingElement, { variant: 'h5' }),
	[HEADING_KEYS.h6]: withProps(HeadingElement, { variant: 'h6' }),
	[HighlightPlugin.key]: HighlightLeaf,
	[HorizontalRulePlugin.key]: HrElement,
	[ItalicPlugin.key]: withProps(PlateLeaf, { as: 'em' }),
	[KbdPlugin.key]: KbdLeaf,
	[ParagraphPlugin.key]: ParagraphElement,
	[StrikethroughPlugin.key]: withProps(PlateLeaf, { as: 's' }),
	[SubscriptPlugin.key]: withProps(PlateLeaf, { as: 'sub' }),
	[SuperscriptPlugin.key]: withProps(PlateLeaf, { as: 'sup' }),
	[UnderlinePlugin.key]: withProps(PlateLeaf, { as: 'u' }),
}

export const editorComponents = {
	...viewComponents,
}

export const useCreateEditor = (
	{
		components,
		override,
		readOnly,
		...options
	}: {
		components?: Record<string, any>
		plugins?: any[]
		readOnly?: boolean
	} & Omit<CreatePlateEditorOptions, 'plugins'> = {},
	deps: any[] = []
) => {
	return usePlateEditor<Value, (typeof editorPlugins)[number]>(
		{
			override: {
				components: {
					...withPlaceholders(withDraggables(editorComponents)),
					...components,
				},
				...override,
			},
			plugins: (readOnly ? viewPlugins : editorPlugins) as any,
			...options,
		},
		deps
	)
}

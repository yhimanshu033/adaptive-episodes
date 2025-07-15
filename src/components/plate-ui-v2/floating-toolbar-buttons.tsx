'use client'

import * as React from 'react'
import { PaintRollIcon } from '@/icons/paint-roll-icon'
import { TextColorIcon } from '@/icons/text-color-icon'
import { BoldIcon, ItalicIcon, UnderlineIcon } from 'lucide-react'
import { KEYS } from 'platejs'
import { useEditorReadOnly } from 'platejs/react'

import { iconVariants } from '@/components/icons'
import { CommentToolbarButton } from '@/components/plate-ui-v2/comment-toolbar-button'
import { FontColorToolbarButton } from '@/components/plate-ui-v2/font-color-toolbar-button'
import { MarkToolbarButton } from '@/components/plate-ui-v2/mark-toolbar-button'
import { ToolbarGroup } from '@/components/plate-ui-v2/toolbar'
import { TurnIntoToolbarButton } from '@/components/plate-ui-v2/turn-into-toolbar-button'

import FloatingLaserBtns from './floating-laser-btns'
import { SuggestionToolbarButton } from './suggestion-toolbar-button'

export function FloatingToolbarButtons() {
	const readOnly = useEditorReadOnly()

	if (readOnly) {
		return null
	}

	return (
		<div className="group flex [&.group_.toolbar-group-content]:mx-0">
			<ToolbarGroup noSeparator>
				<TurnIntoToolbarButton />
			</ToolbarGroup>

			<ToolbarGroup>
				<MarkToolbarButton nodeType={KEYS.bold} tooltip="Bold (⌘+B)">
					<BoldIcon />
				</MarkToolbarButton>

				<MarkToolbarButton nodeType={KEYS.italic} tooltip="Italic (⌘+I)">
					<ItalicIcon />
				</MarkToolbarButton>

				<MarkToolbarButton nodeType={KEYS.underline} tooltip="Underline (⌘+U)">
					<UnderlineIcon />
				</MarkToolbarButton>

				<FontColorToolbarButton nodeType={KEYS.color} tooltip="Text color">
					<TextColorIcon className={iconVariants({ variant: 'toolbar' })} />
				</FontColorToolbarButton>

				<FontColorToolbarButton
					nodeType={KEYS.backgroundColor}
					tooltip="Background color"
				>
					<PaintRollIcon className={iconVariants({ variant: 'toolbar' })} />
				</FontColorToolbarButton>
			</ToolbarGroup>

			<ToolbarGroup
				seperatorProps={{
					variant: 'primary',
				}}
			>
				<FloatingLaserBtns />
			</ToolbarGroup>

			<ToolbarGroup>
				<CommentToolbarButton />
				<SuggestionToolbarButton />
			</ToolbarGroup>
		</div>
	)
}

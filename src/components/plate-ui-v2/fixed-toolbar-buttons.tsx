'use client'

import * as React from 'react'
import { PaintRollIcon } from '@/icons/paint-roll-icon'
import { TextColorIcon } from '@/icons/text-color-icon'
import ViewLS from '@/page-builders/episodes/info/view-ls'
import { BoldIcon, ItalicIcon, UnderlineIcon } from 'lucide-react'
import { KEYS } from 'platejs'
import { useEditorReadOnly } from 'platejs/react'

import { iconVariants } from '../icons'
import { FontDropdownMenu } from '../plate-ui/font-dropdown-menu'
import ToggleFindAndReplace from '../plate-ui/toggle-find-and-replace'
import TranslationToggleButton from '../plate-ui/translation-toggle-button'
import TtsToolbarButton from '../plate-ui/tts-toolbar-button'
import WordCountButton from '../plate-ui/word-count-button'
import { AlignToolbarButton } from './align-toolbar-button'
import { FontColorToolbarButton } from './font-color-toolbar-button'
import { FontSizeToolbarButton } from './font-size-toolbar-button'
import { RedoToolbarButton, UndoToolbarButton } from './history-toolbar-button'
import { LineHeightToolbarButton } from './line-height-toolbar-button'
import { MarkToolbarButton } from './mark-toolbar-button'
import { ToolbarGroup } from './toolbar'
import { TurnIntoToolbarButton } from './turn-into-toolbar-button'

export function FixedToolbarButtons() {
	const readOnly = useEditorReadOnly()

	if (readOnly) {
		return null
	}

	return (
		<div className="flex w-full">
			<ToolbarGroup noSeparator>
				<WordCountButton />
			</ToolbarGroup>
			<ToolbarGroup>
				<UndoToolbarButton />
				<RedoToolbarButton />
			</ToolbarGroup>

			<ToolbarGroup>
				<FontDropdownMenu />
			</ToolbarGroup>

			<ToolbarGroup>
				<FontSizeToolbarButton />
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
			</ToolbarGroup>
			<ToolbarGroup>
				<TurnIntoToolbarButton />
			</ToolbarGroup>
			<ToolbarGroup>
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

			<ToolbarGroup>
				<LineHeightToolbarButton />
			</ToolbarGroup>

			<ToolbarGroup>
				<AlignToolbarButton />
			</ToolbarGroup>

			<div className="grow" />

			<div className="flex">
				<ToolbarGroup>
					<TtsToolbarButton />
				</ToolbarGroup>
				<ToolbarGroup>
					<ToggleFindAndReplace />
				</ToolbarGroup>
				<ToolbarGroup>
					<TranslationToggleButton />
				</ToolbarGroup>
				<ToolbarGroup>
					<ViewLS />
				</ToolbarGroup>
			</div>
		</div>
	)
}

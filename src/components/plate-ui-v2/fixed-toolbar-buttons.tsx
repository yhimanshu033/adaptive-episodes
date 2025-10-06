'use client'

import * as React from 'react'
import { PaintRollIcon } from '@/icons/paint-roll-icon'
import { TextColorIcon } from '@/icons/text-color-icon'
import ViewLS from '@/page-builders/episodes/info/view-ls'
import usePlateStore from '@/store/plate-store'
import { BoldIcon, ItalicIcon, UnderlineIcon } from 'lucide-react'
import { KEYS } from 'platejs'
import { useEditorReadOnly } from 'platejs/react'
import { useShallow } from 'zustand/react/shallow'

import { iconVariants } from '@/components/icons'
import { AlignToolbarButton } from '@/components/plate-ui-v2/align-toolbar-button'
import { ChatbotToolbarButton } from '@/components/plate-ui-v2/chatbot-toggle-button'
import { FontColorToolbarButton } from '@/components/plate-ui-v2/font-color-toolbar-button'
import { FontDropdownMenu } from '@/components/plate-ui-v2/font-dropdown-menu'
import { FontSizeToolbarButton } from '@/components/plate-ui-v2/font-size-toolbar-button'
import {
	RedoToolbarButton,
	UndoToolbarButton,
} from '@/components/plate-ui-v2/history-toolbar-button'
import { LineHeightToolbarButton } from '@/components/plate-ui-v2/line-height-toolbar-button'
import { MarkToolbarButton } from '@/components/plate-ui-v2/mark-toolbar-button'
import ToggleFindAndReplace from '@/components/plate-ui-v2/toggle-find-and-replace'
import { ToolbarGroup } from '@/components/plate-ui-v2/toolbar'
import TranslationToggleButton from '@/components/plate-ui-v2/translation-toggle-button'
import TtsToolbarButton from '@/components/plate-ui-v2/tts-toolbar-button'
import { TurnIntoToolbarButton } from '@/components/plate-ui-v2/turn-into-toolbar-button'

import { ESidebar } from '@/types/plate-types'

import { If } from '../aural-ui/if-else'
import { ScrollArea } from '../aural-ui/scroll-area'
import { ThemeSwitch } from '../theme-toggle'
import ToogleBeatSheetEditor from './toogle-beatsheet-editor'

const toolbarIconVariants = iconVariants({ variant: 'toolbar' })

const markButtons = [
	{ nodeType: KEYS.bold, tooltip: 'Bold (⌘+B)', icon: BoldIcon },
	{ nodeType: KEYS.italic, tooltip: 'Italic (⌘+I)', icon: ItalicIcon },
	{ nodeType: KEYS.underline, tooltip: 'Underline (⌘+U)', icon: UnderlineIcon },
] as const

const MarkButtons = React.memo(() => (
	<>
		{markButtons.map(({ nodeType, tooltip, icon: Icon }) => (
			<MarkToolbarButton key={nodeType} nodeType={nodeType} tooltip={tooltip}>
				<Icon />
			</MarkToolbarButton>
		))}
	</>
))

MarkButtons.displayName = 'MarkButtons'

const ColorButtons = React.memo(() => (
	<>
		<FontColorToolbarButton nodeType={KEYS.color} tooltip="Text color">
			<TextColorIcon className={toolbarIconVariants} />
		</FontColorToolbarButton>

		<FontColorToolbarButton
			nodeType={KEYS.backgroundColor}
			tooltip="Background color"
		>
			<PaintRollIcon className={toolbarIconVariants} />
		</FontColorToolbarButton>
	</>
))

ColorButtons.displayName = 'ColorButtons'

const SimplifiedToolbar = React.memo(
	({
		simplified,
		children,
	}: {
		children?: React.ReactNode
		simplified: boolean
	}) => (
		<>
			<ToolbarGroup noSeparator={simplified}>
				<MarkButtons />
			</ToolbarGroup>
			{children}
			<ToolbarGroup>
				<ColorButtons />
			</ToolbarGroup>
		</>
	)
)

SimplifiedToolbar.displayName = 'SimplifiedToolbar'

const RightToolbarSection = React.memo(() => (
	<div className="flex">
		<ToolbarGroup noSeparator>
			<TtsToolbarButton />
		</ToolbarGroup>
		<ToolbarGroup>
			<ToggleFindAndReplace />
		</ToolbarGroup>
		<ToogleBeatSheetEditor />
		<ToolbarGroup>
			<TranslationToggleButton />
		</ToolbarGroup>
		<ToolbarGroup>
			<ViewLS />
		</ToolbarGroup>
	</div>
))

RightToolbarSection.displayName = 'RightToolbarSection'

// Memoized full toolbar content
const FullToolbarContent = React.memo(() => {
	const readOnly = useEditorReadOnly()
	const { store: usePlateContextStore } = usePlateStore()
	const sidebar = usePlateContextStore(useShallow((state) => state.sidebar))

	return (
		<div className="flex w-full">
			<ScrollArea orientation="horizontal" className="w-full">
				<div className="flex w-full px-6 py-3">
					<If condition={!readOnly && sidebar !== ESidebar.DUAL_VIEW}>
						<ToolbarGroup noSeparator>
							<UndoToolbarButton />
							<RedoToolbarButton />
						</ToolbarGroup>

						<ToolbarGroup>
							<FontDropdownMenu />
						</ToolbarGroup>

						<ToolbarGroup>
							<FontSizeToolbarButton />
						</ToolbarGroup>

						<SimplifiedToolbar simplified={false}>
							<ToolbarGroup>
								<TurnIntoToolbarButton />
							</ToolbarGroup>
						</SimplifiedToolbar>

						<ToolbarGroup>
							<LineHeightToolbarButton />
						</ToolbarGroup>

						<ToolbarGroup>
							<AlignToolbarButton />
						</ToolbarGroup>
					</If>
					<div className="grow" />

					<RightToolbarSection />
					<ThemeSwitch />
				</div>
			</ScrollArea>
			<ChatbotToolbarButton />
		</div>
	)
})

FullToolbarContent.displayName = 'FullToolbarContent'

const SimplifiedToolbarContent = React.memo(() => (
	<div className="flex">
		<SimplifiedToolbar simplified={true} />
	</div>
))

SimplifiedToolbarContent.displayName = 'SimplifiedToolbarContent'

export function FixedToolbarButtons({ simplified }: { simplified?: boolean }) {
	if (simplified) {
		return <SimplifiedToolbarContent />
	}

	return <FullToolbarContent />
}

import React from 'react'
import { PaintRollIcon } from '@/icons/paint-roll-icon'
import { TextColorIcon } from '@/icons/text-color-icon'
import ViewLS from '@/page-builders/episodes/info/view-ls'
import usePlateStore from '@/store/plate-store'
import {
	BoldPlugin,
	ItalicPlugin,
	UnderlinePlugin,
} from '@udecode/plate-basic-marks/react'
import { useEditorReadOnly } from '@udecode/plate-common/react'
import {
	FontBackgroundColorPlugin,
	FontColorPlugin,
} from '@udecode/plate-font/react'
import { ListStyleType } from '@udecode/plate-indent-list'
import { useShallow } from 'zustand/react/shallow'

import { Switch } from '@/components/aural-ui/switch'
import { Icons, iconVariants } from '@/components/icons'
import IfElse, { Else, If } from '@/components/if-else'
import { FontDropdownMenu } from '@/components/plate-ui-v2/font-dropdown-menu'
import ToggleFindAndReplace from '@/components/plate-ui-v2/toggle-find-and-replace'
import TranslationToggleButton from '@/components/plate-ui-v2/translation-toggle-button'
import TtsToolbarButton from '@/components/plate-ui-v2/tts-toolbar-button'
import { AlignDropdownMenu } from '@/components/plate-ui/align-dropdown-menu'
import { ColorDropdownMenu } from '@/components/plate-ui/color-dropdown-menu'
import { LineHeightDropdownMenu } from '@/components/plate-ui/line-height-dropdown-menu'
import { MarkToolbarButton } from '@/components/plate-ui/mark-toolbar-button'
import { ToolbarGroup } from '@/components/plate-ui/toolbar'
import { TurnIntoDropdownMenu } from '@/components/plate-ui/turn-into-dropdown-menu'
import UndoRedoButtons from '@/components/plate-ui/undo-redo-buttons'
import { ZoomDropdownMenu } from '@/components/plate-ui/zoom-dropdown'

import { ESidebar } from '@/types/plate-types'

import { ChatbotToolbarButton } from '../plate-ui-v2/chatbot-toggle-button'
import WordCountButton from '../plate-ui-v2/word-count-button'
import { IndentListToolbarButton } from './indent-list-toolbar-button'

const SimplifiedToolbar = ({
	simplified,
	children,
}: {
	children?: React.ReactNode
	simplified: boolean
}) => {
	return (
		<>
			<ToolbarGroup noSeparator={simplified}>
				<MarkToolbarButton nodeType={BoldPlugin.key} tooltip="Bold (⌘+B)">
					<Icons.bold />
				</MarkToolbarButton>
				<MarkToolbarButton nodeType={ItalicPlugin.key} tooltip="Italic (⌘+I)">
					<Icons.italic />
				</MarkToolbarButton>
				<MarkToolbarButton
					nodeType={UnderlinePlugin.key}
					tooltip="Underline (⌘+U)"
				>
					<Icons.underline />
				</MarkToolbarButton>
			</ToolbarGroup>
			{children}
			<ToolbarGroup>
				<ColorDropdownMenu nodeType={FontColorPlugin.key} tooltip="Text Color">
					<TextColorIcon className={iconVariants({ variant: 'toolbar' })} />
				</ColorDropdownMenu>
				<ColorDropdownMenu
					nodeType={FontBackgroundColorPlugin.key}
					tooltip="Highlight Color"
				>
					<PaintRollIcon className={iconVariants({ variant: 'toolbar' })} />
				</ColorDropdownMenu>
			</ToolbarGroup>
		</>
	)
}

export function FixedToolbarButtons({ simplified }: { simplified?: boolean }) {
	const readOnly = useEditorReadOnly()
	const { store: usePlateContextStore, setFocusMode } = usePlateStore()
	const focusMode = usePlateContextStore(useShallow((state) => state.focusMode))
	const sidebar = usePlateContextStore(useShallow((state) => state.sidebar))

	if (simplified) {
		return (
			<div className="flex">
				<SimplifiedToolbar simplified={simplified} />
				<ToolbarGroup>
					<IndentListToolbarButton nodeType={ListStyleType.Disc} />
				</ToolbarGroup>
			</div>
		)
	}

	return (
		<div className="w-full">
			<div className="w-full overflow-hidden">
				<div
					className="flex flex-wrap items-center"
					style={{
						transform: 'translateX(calc(-1px))',
					}}
				>
					<If condition={!readOnly && sidebar !== ESidebar.DUAL_VIEW}>
						<div className="flex">
							<ToolbarGroup noSeparator>
								<WordCountButton />
							</ToolbarGroup>
							<ToolbarGroup>
								<UndoRedoButtons />
							</ToolbarGroup>
							<ToolbarGroup>
								<ZoomDropdownMenu />
							</ToolbarGroup>
							<ToolbarGroup>
								<FontDropdownMenu />
							</ToolbarGroup>
							<SimplifiedToolbar simplified={!!simplified}>
								<ToolbarGroup>
									<TurnIntoDropdownMenu />
								</ToolbarGroup>
							</SimplifiedToolbar>
							<ToolbarGroup>
								<LineHeightDropdownMenu />
							</ToolbarGroup>
							<ToolbarGroup>
								<AlignDropdownMenu />
							</ToolbarGroup>
						</div>
					</If>
					<div className="grow" />
					<IfElse condition={focusMode}>
						<If>
							<div className="p-2">
								<Switch
									className="bg-primary"
									checked={focusMode}
									onCheckedChange={setFocusMode}
								/>
							</div>
						</If>
						<Else>
							<div className="flex">
								<ToolbarGroup noSeparator>
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
						</Else>
					</IfElse>
				</div>
			</div>
			<ChatbotToolbarButton />
		</div>
	)
}

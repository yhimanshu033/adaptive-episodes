import React from 'react'
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

import { Icons, iconVariants } from '@/components/icons'
import IfElse, { Else, If } from '@/components/if-else'
import { AlignDropdownMenu } from '@/components/plate-ui/align-dropdown-menu'
import { ChatbotToolbarButton } from '@/components/plate-ui/chatbot-toggle-button'
import { ColorDropdownMenu } from '@/components/plate-ui/color-dropdown-menu'
import { FontDropdownMenu } from '@/components/plate-ui/font-dropdown-menu'
import { LineHeightDropdownMenu } from '@/components/plate-ui/line-height-dropdown-menu'
import { MarkToolbarButton } from '@/components/plate-ui/mark-toolbar-button'
import { MoreDropdownMenu } from '@/components/plate-ui/more-dropdown-menu'
import { ToolbarGroup } from '@/components/plate-ui/toolbar'
import TranslationToggleButton from '@/components/plate-ui/translation-toggle-button'
import TtsToolbarButton from '@/components/plate-ui/tts-toolbar-button'
import { TurnIntoDropdownMenu } from '@/components/plate-ui/turn-into-dropdown-menu'
import UndoRedoButtons from '@/components/plate-ui/undo-redo-buttons'
import { ZoomDropdownMenu } from '@/components/plate-ui/zoom-dropdown'
import { Switch } from '@/components/ui/switch'

import { IndentListToolbarButton } from './indent-list-toolbar-button'
import WordCountButton from './word-count-button'

export function FixedToolbarButtons({ simplified }: { simplified?: boolean }) {
	const readOnly = useEditorReadOnly()
	const { store: usePlateContextStore, setFocusMode } = usePlateStore()
	const focusMode = usePlateContextStore(useShallow((state) => state.focusMode))

	const SimplifiedToolbar = () => {
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

				<ToolbarGroup>
					<ColorDropdownMenu
						nodeType={FontColorPlugin.key}
						tooltip="Text Color"
					>
						<Icons.color className={iconVariants({ variant: 'toolbar' })} />
					</ColorDropdownMenu>
					<ColorDropdownMenu
						nodeType={FontBackgroundColorPlugin.key}
						tooltip="Highlight Color"
					>
						<Icons.bg className={iconVariants({ variant: 'toolbar' })} />
					</ColorDropdownMenu>
				</ToolbarGroup>
			</>
		)
	}

	if (simplified) {
		return (
			<div className="flex">
				<SimplifiedToolbar />
				<ToolbarGroup>
					<IndentListToolbarButton nodeType={ListStyleType.Disc} />
				</ToolbarGroup>
			</div>
		)
	}

	return (
		<div className="w-full overflow-hidden">
			<div
				className="flex flex-wrap items-center"
				style={{
					transform: 'translateX(calc(-1px))',
				}}
			>
				<If condition={!readOnly}>
					<div className="flex">
						<ToolbarGroup noSeparator>
							<WordCountButton />
						</ToolbarGroup>

						<ToolbarGroup>
							<TurnIntoDropdownMenu />
							<FontDropdownMenu />
						</ToolbarGroup>
						<SimplifiedToolbar />
						<ToolbarGroup>
							<UndoRedoButtons />
							<ZoomDropdownMenu />
						</ToolbarGroup>

						<ToolbarGroup>
							<AlignDropdownMenu />
							<LineHeightDropdownMenu />
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
								<TranslationToggleButton />
								<ChatbotToolbarButton />
								<TtsToolbarButton />
								<MoreDropdownMenu />
							</ToolbarGroup>
						</div>
					</Else>
				</IfElse>
			</div>
		</div>
	)
}

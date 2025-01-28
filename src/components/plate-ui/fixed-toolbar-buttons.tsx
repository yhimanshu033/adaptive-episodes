import React from 'react'
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

import { Icons, iconVariants } from '@/components/icons'
import { AlignDropdownMenu } from '@/components/plate-ui/align-dropdown-menu'
import { ChatbotToolbarButton } from '@/components/plate-ui/chatbot-toggle-button'
import { ColorDropdownMenu } from '@/components/plate-ui/color-dropdown-menu'
import { CommentToolbarButton } from '@/components/plate-ui/comment-toolbar-button'
import { FixedToolbarClose } from '@/components/plate-ui/fixed-toolbar-close'
import { FontDropdownMenu } from '@/components/plate-ui/font-dropdown-menu'
import { LineHeightDropdownMenu } from '@/components/plate-ui/line-height-dropdown-menu'
import { MarkToolbarButton } from '@/components/plate-ui/mark-toolbar-button'
import { ModeDropdownMenu } from '@/components/plate-ui/mode-dropdown-menu'
import { MoreDropdownMenu } from '@/components/plate-ui/more-dropdown-menu'
import { ToolbarGroup } from '@/components/plate-ui/toolbar'
import TranslationToggleButton from '@/components/plate-ui/translation-toggle-button'
import { TurnIntoDropdownMenu } from '@/components/plate-ui/turn-into-dropdown-menu'
import UndoRedoButtons from '@/components/plate-ui/undo-redo-buttons'
import { ZoomDropdownMenu } from '@/components/plate-ui/zoom-dropdown'

export function FixedToolbarButtons() {
	const readOnly = useEditorReadOnly()

	return (
		<div className="w-full overflow-hidden">
			<div
				className="flex flex-wrap"
				style={{
					transform: 'translateX(calc(-1px))',
				}}
			>
				{!readOnly && (
					<>
						<ToolbarGroup noSeparator>
							<TurnIntoDropdownMenu />
							<FontDropdownMenu />
						</ToolbarGroup>

						<ToolbarGroup>
							<MarkToolbarButton nodeType={BoldPlugin.key} tooltip="Bold (⌘+B)">
								<Icons.bold />
							</MarkToolbarButton>
							<MarkToolbarButton
								nodeType={ItalicPlugin.key}
								tooltip="Italic (⌘+I)"
							>
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

						<ToolbarGroup>
							<UndoRedoButtons />
							<ZoomDropdownMenu />
						</ToolbarGroup>

						<ToolbarGroup>
							<AlignDropdownMenu />
							<LineHeightDropdownMenu />
						</ToolbarGroup>
					</>
				)}

				<div className="grow" />

				<ToolbarGroup noSeparator>
					<TranslationToggleButton />
					<ChatbotToolbarButton />
					<MoreDropdownMenu />
				</ToolbarGroup>

				<ToolbarGroup>
					<CommentToolbarButton />
				</ToolbarGroup>

				<ToolbarGroup>
					<ModeDropdownMenu />
					<FixedToolbarClose />
				</ToolbarGroup>
			</div>
		</div>
	)
}

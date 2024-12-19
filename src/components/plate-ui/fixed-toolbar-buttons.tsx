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
import { ListStyleType } from '@udecode/plate-indent-list'

import { Icons, iconVariants } from '@/components/icons'
import { AlignDropdownMenu } from '@/components/plate-ui/align-dropdown-menu'
import { CommentToolbarButton } from '@/components/plate-ui/comment-toolbar-button'
import { IndentListToolbarButton } from '@/components/plate-ui/indent-list-toolbar-button'
import { LineHeightDropdownMenu } from '@/components/plate-ui/line-height-dropdown-menu'

import { ChatbotToolbarButton } from './chatbot-toggle-button'
import { ColorDropdownMenu } from './color-dropdown-menu'
import { FixedToolbarClose } from './fixed-toolbar-close'
import { MarkToolbarButton } from './mark-toolbar-button'
import { ModeDropdownMenu } from './mode-dropdown-menu'
import { MoreDropdownMenu } from './more-dropdown-menu'
import { ToolbarGroup } from './toolbar'
import TranslationToggleButton from './translation-toggle-button'
import { TurnIntoDropdownMenu } from './turn-into-dropdown-menu'
import UndoRedoButtons from './undo-redo-buttons'
import { ZoomDropdownMenu } from './zoom-dropdown'

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
							<IndentListToolbarButton nodeType={ListStyleType.Disc} />
							<IndentListToolbarButton nodeType={ListStyleType.Decimal} />
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

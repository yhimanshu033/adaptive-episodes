import React from 'react'
import {
	BoldPlugin,
	CodePlugin,
	ItalicPlugin,
	StrikethroughPlugin,
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
import { LinkToolbarButton } from '@/components/plate-ui/link-toolbar-button'

import { ChatbotToolbarButton } from './chatbot-toggle-button'
import { ColorDropdownMenu } from './color-dropdown-menu'
import { InsertDropdownMenu } from './insert-dropdown-menu'
import { MarkToolbarButton } from './mark-toolbar-button'
import { ModeDropdownMenu } from './mode-dropdown-menu'
import { OutlineToolbarButton } from './outline-toggle-button'
import { ToolbarGroup } from './toolbar'
import TranslationToggleButton from './translation-toggle-button'
import { TurnIntoDropdownMenu } from './turn-into-dropdown-menu'

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
							<InsertDropdownMenu />
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

							<MarkToolbarButton
								nodeType={StrikethroughPlugin.key}
								tooltip="Strikethrough (⌘+⇧+X)"
							>
								<Icons.strikethrough />
							</MarkToolbarButton>
							<MarkToolbarButton nodeType={CodePlugin.key} tooltip="Code (⌘+E)">
								<Icons.code />
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
							<AlignDropdownMenu />

							<LineHeightDropdownMenu />

							<IndentListToolbarButton nodeType={ListStyleType.Disc} />
							<IndentListToolbarButton nodeType={ListStyleType.Decimal} />
							{/* <IndentTodoToolbarButton /> */}

							{/* <OutdentToolbarButton /> */}
							{/* <IndentToolbarButton /> */}
						</ToolbarGroup>

						<ToolbarGroup>
							<LinkToolbarButton />

							{/* <MediaToolbarButton nodeType={ImagePlugin.key} /> */}

							{/* <TableDropdownMenu /> */}

							{/* <EmojiDropdownMenu /> */}

							{/* <MoreDropdownMenu /> */}
						</ToolbarGroup>
					</>
				)}

				<div className="grow" />

				<ToolbarGroup noSeparator>
					<TranslationToggleButton />
					<ChatbotToolbarButton />
					<OutlineToolbarButton />
					<CommentToolbarButton />
					<ModeDropdownMenu />
				</ToolbarGroup>
			</div>
		</div>
	)
}

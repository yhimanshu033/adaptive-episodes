import React from 'react'
import { PaintRollIcon } from '@/icons/paint-roll-icon'
import { TextColorIcon } from '@/icons/text-color-icon'
import usePlateStore from '@/store/plate-store'
import {
	BoldPlugin,
	ItalicPlugin,
	UnderlinePlugin,
} from '@udecode/plate-basic-marks/react'
import {
	CommentsPlugin,
	useCommentAddButton,
} from '@udecode/plate-comments/react'
import { useEditorReadOnly } from '@udecode/plate-common/react'
import {
	FontBackgroundColorPlugin,
	FontColorPlugin,
} from '@udecode/plate-font/react'

import { Icons, iconVariants } from '@/components/icons'
import FloatingLaserBtns from '@/components/plate-ui-v2/floating-laser-btns'
import { ColorDropdownMenu } from '@/components/plate-ui/color-dropdown-menu'
import { MarkToolbarButton } from '@/components/plate-ui/mark-toolbar-button'
import { ToolbarGroup } from '@/components/plate-ui/toolbar'
import { TurnIntoDropdownMenu } from '@/components/plate-ui/turn-into-dropdown-menu'

import { ESidebar } from '@/types/plate-types'

const FloatingToolbarButtons = () => {
	const readOnly = useEditorReadOnly()
	const { props } = useCommentAddButton()

	const { setSidebar } = usePlateStore()

	if (readOnly) {
		return null
	}

	return (
		<div className="group flex [&.group_.toolbar-group-content]:mx-0">
			<ToolbarGroup noSeparator>
				<TurnIntoDropdownMenu
					buttonProps={{
						size: 'floating',
					}}
				/>
			</ToolbarGroup>
			<ToolbarGroup
				seperatorProps={{
					variant: 'primary',
				}}
			>
				<MarkToolbarButton
					nodeType={BoldPlugin.key}
					tooltip="Bold (⌘+B)"
					size="floating"
				>
					<Icons.bold />
				</MarkToolbarButton>
				<MarkToolbarButton
					nodeType={ItalicPlugin.key}
					tooltip="Italic (⌘+I)"
					size="floating"
				>
					<Icons.italic />
				</MarkToolbarButton>
				<MarkToolbarButton
					nodeType={UnderlinePlugin.key}
					tooltip="Underline (⌘+U)"
					size="floating"
				>
					<Icons.underline />
				</MarkToolbarButton>
				<ColorDropdownMenu
					nodeType={FontColorPlugin.key}
					tooltip="Text Color"
					buttonProps={{
						size: 'floating',
					}}
				>
					<TextColorIcon className={iconVariants({ variant: 'toolbar' })} />
				</ColorDropdownMenu>
				<ColorDropdownMenu
					nodeType={FontBackgroundColorPlugin.key}
					tooltip="Highlight Color"
					buttonProps={{
						size: 'floating',
					}}
				>
					<PaintRollIcon className={iconVariants({ variant: 'toolbar' })} />
				</ColorDropdownMenu>
			</ToolbarGroup>
			<ToolbarGroup
				seperatorProps={{
					variant: 'primary',
				}}
			>
				<FloatingLaserBtns />
			</ToolbarGroup>
			<ToolbarGroup
				seperatorProps={{
					variant: 'primary',
				}}
			>
				<MarkToolbarButton
					{...props}
					onClick={(e) => {
						setSidebar(ESidebar.COMMENTS)
						props.onClick(e)
					}}
					nodeType={CommentsPlugin.key}
					tooltip="Comment (⌘+⇧+M)"
					size="floating"
				>
					<Icons.commentAdd />
				</MarkToolbarButton>
			</ToolbarGroup>
		</div>
	)
}

FloatingToolbarButtons.displayName = 'FloatingToolbarButtons'

export { FloatingToolbarButtons }

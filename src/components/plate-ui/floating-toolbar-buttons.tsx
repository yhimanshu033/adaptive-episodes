import React, { useState } from 'react'
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
import { Bot } from 'lucide-react'

import { Icons, iconVariants } from '@/components/icons'
import { ColorDropdownMenu } from '@/components/plate-ui/color-dropdown-menu'
import FloatingLaserBtns from '@/components/plate-ui/floating-laser-btns'
import { MarkToolbarButton } from '@/components/plate-ui/mark-toolbar-button'
import { ToolbarGroup } from '@/components/plate-ui/toolbar'
import { TurnIntoDropdownMenu } from '@/components/plate-ui/turn-into-dropdown-menu'
import { LaserPlugin } from '@/lib/plate/plugins/laser-plugin'

import { ESidebar } from '@/types/plate-types'

const FloatingToolbarButtons = () => {
	const readOnly = useEditorReadOnly()
	const { props } = useCommentAddButton()
	const [showRephrase, setShowRephrase] = useState(false)

	const { setSidebar } = usePlateStore()

	if (readOnly) {
		return <></>
	}

	if (!readOnly && showRephrase) {
		return <FloatingLaserBtns setShowLaser={setShowRephrase} />
	}
	return (
		<div className="flex">
			<ToolbarGroup noSeparator>
				<TurnIntoDropdownMenu />
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
				<ColorDropdownMenu nodeType={FontColorPlugin.key} tooltip="Text Color">
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
				<MarkToolbarButton
					onClick={() => {
						setShowRephrase(true)
					}}
					nodeType={LaserPlugin.key}
					tooltip="Laser (⌘+B)"
				>
					<Bot />
				</MarkToolbarButton>
				{!showRephrase && (
					<MarkToolbarButton
						{...props}
						onClick={(e) => {
							setSidebar(ESidebar.COMMENTS)
							props.onClick(e)
						}}
						nodeType={CommentsPlugin.key}
						tooltip="Comment (⌘+⇧+M)"
					>
						<Icons.commentAdd />
					</MarkToolbarButton>
				)}
			</ToolbarGroup>
		</div>
	)
}

FloatingToolbarButtons.displayName = 'FloatingToolbarButtons'

export { FloatingToolbarButtons }

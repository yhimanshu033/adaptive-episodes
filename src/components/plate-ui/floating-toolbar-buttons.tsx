import React, { useState } from 'react'
import { setActiveLaser } from '@/store/laser-store'
import { setSidebar } from '@/store/plate-store'
import {
	BoldPlugin,
	ItalicPlugin,
	UnderlinePlugin,
} from '@udecode/plate-basic-marks/react'
import {
	CommentsPlugin,
	useCommentAddButton,
} from '@udecode/plate-comments/react'
import { useEditorReadOnly, useEditorRef } from '@udecode/plate-common/react'
import {
	FontBackgroundColorPlugin,
	FontColorPlugin,
} from '@udecode/plate-font/react'
import { Bot } from 'lucide-react'
import { nanoid } from 'nanoid'

import { Icons, iconVariants } from '@/components/icons'
import { LaserPlugin } from '@/lib/plate/plugins/laser-plugin'

import { ColorDropdownMenu } from './color-dropdown-menu'
import { MarkToolbarButton } from './mark-toolbar-button'
import { ToolbarGroup } from './toolbar'
import { TurnIntoDropdownMenu } from './turn-into-dropdown-menu'

const FloatingToolbarButtons = () => {
	const readOnly = useEditorReadOnly()
	const { props } = useCommentAddButton()
	const [showRephrase, setShowRephrase] = useState(false)

	const editor = useEditorRef()

	return (
		<>
			{!readOnly && !showRephrase && (
				<div className="flex">
					<>
						<ToolbarGroup noSeparator>
							<TurnIntoDropdownMenu />
							<MarkToolbarButton nodeType={BoldPlugin.key} tooltip="Bold (⌘+B)">
								<Icons.bold />
							</MarkToolbarButton>
							<MarkToolbarButton
								onClick={() => {
									setShowRephrase(true)
									const key = `laser-${nanoid()}`
									editor.tf.toggle.mark({ key: LaserPlugin.key })
									editor.tf.toggle.mark({ key })
									setActiveLaser(key)
								}}
								nodeType={LaserPlugin.key}
								tooltip="Laser (⌘+B)"
							>
								<Bot />
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
						{/* <Input /> */}
					</>
					<ToolbarGroup>
						{!showRephrase && (
							<MarkToolbarButton
								{...props}
								onClick={(e) => {
									setSidebar('comments')
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
			)}
		</>
	)
}

FloatingToolbarButtons.displayName = 'FloatingToolbarButtons'

export { FloatingToolbarButtons }

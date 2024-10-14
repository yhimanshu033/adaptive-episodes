import React, { useState } from 'react'
import useComments from '@/hooks/plate/use-comments'
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
import { useEditorReadOnly } from '@udecode/plate-common/react'
import {
	FontBackgroundColorPlugin,
	FontColorPlugin,
} from '@udecode/plate-font/react'

import { Icons, iconVariants } from '@/components/icons'

import { ColorDropdownMenu } from './color-dropdown-menu'
import { MarkToolbarButton } from './mark-toolbar-button'
import RephraseSelection from './rephrase-selection'
import { TurnIntoDropdownMenu } from './turn-into-dropdown-menu'

export function FloatingToolbarButtons() {
	const readOnly = useEditorReadOnly()
	const { props } = useCommentAddButton()
	const [showRephrase, setShowRephrase] = useState(false)
	const { commentExists } = useComments()

	return (
		<>
			{!readOnly && (
				<>
					{!showRephrase && (
						<>
							<TurnIntoDropdownMenu />
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
						</>
					)}
					<RephraseSelection
						setShowRephrase={setShowRephrase}
						showRephrase={showRephrase}
					/>
					{!commentExists && !showRephrase && (
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
				</>
			)}
		</>
	)
}

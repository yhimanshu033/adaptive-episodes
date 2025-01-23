import React from 'react'
import useDisableTools from '@/hooks/use-disable-tools'
import usePlateStore from '@/store/plate-store'
import type { DropdownMenuProps } from '@radix-ui/react-dropdown-menu'
import { useEditorState } from '@udecode/plate-common/react'
import { Globe, Search, WholeWordIcon } from 'lucide-react'

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
	useOpenState,
} from '@/components/plate-ui/dropdown-menu'
import { ToolbarButton } from '@/components/plate-ui/toolbar'
import { prettifyNumber } from '@/lib/utils/helpers'
import { getText } from '@/lib/utils/plate'

import { ESidebar } from '@/types/plate-types'

import DownloadDocxButton from './download-docx-button'

export function MoreDropdownMenu(props: DropdownMenuProps) {
	const { setSidebar } = usePlateStore()
	const openState = useOpenState()
	const { children } = useEditorState()
	const { isDisabled } = useDisableTools()
	const text = getText(children)
	const words = text
		.split(/\s+/)
		.filter((w) => w.trim().length > 0 && /^[^\d\s]+$/.test(w))
	return (
		<DropdownMenu modal={false} {...openState} {...props}>
			<DropdownMenuTrigger asChild>
				<ToolbarButton pressed={openState.open} tooltip="Story Explorer +">
					<Search />
				</ToolbarButton>
			</DropdownMenuTrigger>

			<DropdownMenuContent
				className="flex max-h-[500px] min-w-[180px] flex-col gap-0.5 overflow-y-auto"
				align="start"
			>
				<DropdownMenuItem
					disabled={isDisabled}
					onSelect={() => {
						setSidebar(ESidebar.FAR, true)
					}}
				>
					<Globe className="mr-2 size-5" />
					Localization
				</DropdownMenuItem>
				<DropdownMenuItem
					disabled={isDisabled}
					onSelect={() => {
						setSidebar(ESidebar.OUTLINE, true)
					}}
				>
					<Search className="mr-2 size-5" />
					Story Explorer
				</DropdownMenuItem>
				<DownloadDocxButton />
				<DropdownMenuItem disabled>
					<WholeWordIcon className="mr-2 size-5" />
					Words: {prettifyNumber(words.length)}
					{/* (⌘+.) */}
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}

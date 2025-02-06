import React from 'react'
import useDisableTools from '@/hooks/use-disable-tools'
import usePlateStore from '@/store/plate-store'
import type { DropdownMenuProps } from '@radix-ui/react-dropdown-menu'
import { Globe, NotebookPen, Search } from 'lucide-react'

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
	useOpenState,
} from '@/components/plate-ui/dropdown-menu'
import { ToolbarButton } from '@/components/plate-ui/toolbar'

import { ESidebar } from '@/types/plate-types'

export function MoreDropdownMenu(props: DropdownMenuProps) {
	const { setSidebar } = usePlateStore()
	const openState = useOpenState()
	const { isDisabled } = useDisableTools()
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
				<DropdownMenuItem onSelect={() => setSidebar(ESidebar.NOTES, true)}>
					<NotebookPen className="mr-2 size-5" />
					Notes
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}

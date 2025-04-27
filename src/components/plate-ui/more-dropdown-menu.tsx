import React from 'react'
import useDisableTools from '@/hooks/use-disable-tools'
import useIsGerman from '@/hooks/use-is-german'
import usePlateStore from '@/store/plate-store'
import type { DropdownMenuProps } from '@radix-ui/react-dropdown-menu'
import { Focus, Globe, Search } from 'lucide-react'

import IfElse from '@/components/if-else'
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
	const { setSidebar, setFocusMode } = usePlateStore()
	const openState = useOpenState()
	const { isDisabled } = useDisableTools()
	const isGerman = useIsGerman()

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
					<IfElse
						condition={!!isGerman}
						if={'Localization'}
						else={'Find & Replace'}
					/>
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
				<DropdownMenuItem
					disabled={isDisabled}
					onSelect={() => {
						setFocusMode(true)
						setSidebar(null)
					}}
				>
					<Focus className="mr-2 size-5" />
					Focus Mode
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}

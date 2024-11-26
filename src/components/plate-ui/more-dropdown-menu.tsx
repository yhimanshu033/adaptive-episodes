import React from 'react'
import { setSidebar } from '@/store/plate-store'
import type { DropdownMenuProps } from '@radix-ui/react-dropdown-menu'
import { useEditorState } from '@udecode/plate-common/react'
import { Globe, Search, WholeWordIcon } from 'lucide-react'

import { getText, prettifyNumber } from '@/lib/utils'

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
	useOpenState,
} from './dropdown-menu'
import { ToolbarButton } from './toolbar'

export function MoreDropdownMenu(props: DropdownMenuProps) {
	const openState = useOpenState()
	const { children } = useEditorState()
	const text = getText(children)
	const words = text
		.split(/\s+/)
		.filter((w) => w.trim().length > 0 && /^[^\d\s]+$/.test(w))
	return (
		<DropdownMenu modal={false} {...openState} {...props}>
			<DropdownMenuTrigger asChild>
				<ToolbarButton pressed={openState.open} tooltip="Story Explorer">
					<Search />
				</ToolbarButton>
			</DropdownMenuTrigger>

			<DropdownMenuContent
				className="flex max-h-[500px] min-w-[180px] flex-col gap-0.5 overflow-y-auto"
				align="start"
			>
				<DropdownMenuItem
					onSelect={() => {
						setSidebar('far', true)
					}}
				>
					<Globe className="mr-2 size-5" />
					Localization
				</DropdownMenuItem>
				<DropdownMenuItem
					onSelect={() => {
						setSidebar('outline', true)
					}}
				>
					<Search className="mr-2 size-5" />
					Story Explorer
				</DropdownMenuItem>
				<DropdownMenuItem disabled>
					<WholeWordIcon className="mr-2 size-5" />
					Words: {prettifyNumber(words.length)}
					{/* (⌘+.) */}
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}

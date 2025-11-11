import React from 'react'
import ChevronUpIcon from '@/icons/chevron-up-icon'
import { outlinerChatModeToTitle } from '@/page-builders/plate-editor/sidebar-sections/outliner/lib/constants'
import useOutliner from '@/page-builders/plate-editor/sidebar-sections/outliner/provider'
import { Settings } from 'lucide-react'

import { Button } from '@/components/aural-ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/aural-ui/dropdown'

export default function OutlinerPromptDropDown() {
	const { outlinerChatMode, outlinerDropDownOptions, setOutlinerChatMode } =
		useOutliner()
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					size="sm"
					variant="outline"
					className="text-fm-tertiary"
					innerClassName="border-none bg-fm-surface-frosted/20 h-6 !px-2"
					type="button"
				>
					<Settings size={12} />
					<p className="flex items-center gap-1">
						Mode:
						<span>{outlinerChatModeToTitle[outlinerChatMode]}</span>
					</p>
					<ChevronUpIcon className="w-4" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="start" side="top" className="w-fit">
				{outlinerDropDownOptions.map((val, index) => (
					<DropdownMenuItem
						onClick={() => setOutlinerChatMode(val)}
						className="flex items-center gap-2 py-2 hover:bg-inherit"
						key={`outliner-dropdown-item-${index}`}
					>
						<p className="text-sm">{outlinerChatModeToTitle[val]}</p>
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	)
}

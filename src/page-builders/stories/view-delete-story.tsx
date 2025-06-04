import React from 'react'
import { PencilIcon } from '@/icons/pencil-icon'
import { VerticalMenuIcon } from '@/icons/test-icons'
import { TrashIcon } from '@/icons/trash-icon'

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/aural-ui/dropdown'
import { IconButton } from '@/components/aural-ui/icon-button'

const ViewDeleteStory = () => {
	const onDelete = (e: React.MouseEvent) => {
		e.stopPropagation()
	}
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<div className="absolute right-1 bottom-2 opacity-0 transition-opacity group-hover:opacity-100 data-[state=open]:opacity-100">
					<IconButton
						label="Option menu"
						icon={<VerticalMenuIcon className="size-4.5" />}
						shape="square"
						variant="ghost"
						className="p-1"
					/>
				</div>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuGroup>
					<DropdownMenuItem>
						<PencilIcon className="size-4" /> View
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem onClick={onDelete}>
						<TrashIcon /> Delete
					</DropdownMenuItem>
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}

export default ViewDeleteStory

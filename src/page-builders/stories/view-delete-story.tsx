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

interface IViewDeleteStoryProps {
	onOpenChange: (open: boolean) => void
}

const ViewDeleteStory = ({ onOpenChange }: IViewDeleteStoryProps) => {
	const onDelete = (e: React.MouseEvent) => {
		e.stopPropagation()
	}
	return (
		<DropdownMenu onOpenChange={onOpenChange}>
			<DropdownMenuTrigger asChild>
				<div className="absolute right-1 bottom-2 opacity-0 transition-opacity group-hover:opacity-100 data-[state=open]:opacity-100">
					<IconButton
						label="Option menu"
						icon={<VerticalMenuIcon className="z-10 size-4.5" />}
						variant="ghost"
						className="!rounded-fm-m p-1"
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

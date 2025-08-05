import React from 'react'
import Link from 'next/link'
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
	useOpenState,
} from '@/components/aural-ui/dropdown'
import { IconButton } from '@/components/aural-ui/icon-button'

import DeleteStoryModal from './delete-story-modal'

interface IViewDeleteStoryProps {
	onOpenChange: (open: boolean) => void
	storyId?: number
	storyTitle?: string
}

const ViewDeleteStory = ({
	onOpenChange,
	storyTitle,
	storyId,
}: IViewDeleteStoryProps) => {
	const { open, onOpenChange: onOpen } = useOpenState()

	const onDelete = () => {
		onOpen(true)
	}

	return (
		<>
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
						<DropdownMenuItem asChild>
							<Link href={`/projects/${storyId}`}>
								<PencilIcon className="size-4" /> View
							</Link>
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem onClick={onDelete} className="text-fm-negative">
							<TrashIcon className="text-inherit" /> Delete
						</DropdownMenuItem>
					</DropdownMenuGroup>
				</DropdownMenuContent>
			</DropdownMenu>
			<DeleteStoryModal
				onOpenChange={onOpen}
				open={open}
				storyTitle={storyTitle}
				storyId={storyId}
			/>
		</>
	)
}

export default ViewDeleteStory

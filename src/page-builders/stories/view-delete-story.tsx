import React, { ReactNode } from 'react'
import { TrashIcon } from '@/icons/trash-icon'
import { PencilIcon } from 'lucide-react'

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/aural-ui/dropdown'

type ViewDeleteStoryProps = {
	children: ReactNode
}

// TO-DO : Replace Pencil icon once available

const ViewDeleteStory: React.FC<ViewDeleteStoryProps> = ({ children }) => {
	const onDelete = (e: React.MouseEvent) => {
		e.stopPropagation()
		// BE support is not available for now
	}
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuGroup>
					<DropdownMenuItem>
						{' '}
						<PencilIcon className="size-4" /> View
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem onClick={onDelete}>
						{' '}
						<TrashIcon /> Delete
					</DropdownMenuItem>
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}

export default ViewDeleteStory

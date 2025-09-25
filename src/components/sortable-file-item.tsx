import React from 'react'
import { FileChartIcon } from '@/icons/file-chart-icon'
import { TrashIcon } from '@/icons/trash-icon'
import DeleteModal from '@/page-builders/stories/delete-modal'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical } from 'lucide-react'

import { Button } from '@/components/aural-ui/button'
import { Typography } from '@/components/aural-ui/typography'
import { cn } from '@/lib/aural-ui/utils'
import { formatFileSize } from '@/lib/utils/helpers'

interface SortableFileItemProps {
	file: File
	id: string
	index: number
	onDelete: (
		e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
		index: number
	) => void
}

export function SortableFileItem({
	id,
	file,
	index,
	onDelete,
}: SortableFileItemProps) {
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
		setActivatorNodeRef,
	} = useSortable({
		id,
		data: {
			type: 'file',
			file,
			index,
		},
	})

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	}

	return (
		<div
			ref={setNodeRef}
			style={style}
			className={cn(
				'bg-fm-bg-secondary flex w-full items-center justify-between gap-3 rounded px-3 py-2 transition-all duration-200',
				{
					'z-10 opacity-50 shadow-lg': isDragging,
				}
			)}
			onClick={(e) => e.stopPropagation()}
		>
			<div className="flex min-w-0 items-center gap-3">
				<div
					{...attributes}
					{...listeners}
					ref={setActivatorNodeRef}
					className="hover:text-foreground cursor-grab text-gray-500 transition-all hover:scale-110 active:cursor-grabbing"
				>
					<GripVertical size={16} />
				</div>
				<FileChartIcon className="text-fm-secondary-800 flex-shrink-0" />
				<div className="flex min-w-0 flex-col">
					<Typography as="div" className="truncate" variant="caption-large">
						{file.name}
					</Typography>
					<Typography
						as="div"
						color="tertiary"
						variant="caption-medium"
						transform="uppercase"
						className="font-fm-brand"
					>
						{formatFileSize(file.size)}
					</Typography>
				</div>
			</div>
			<DeleteModal
				title="Delete uploaded file"
				subTitle="Once deleted, this can't be undone. Don't worry! You can always upload a new file."
				onPrimaryClick={(e) => onDelete(e, index)}
			>
				<Button
					variant="text"
					className="text-fm-negative gap-2 transition-transform hover:scale-105"
					innerClassName="!p-0 translate-y-0"
				>
					<TrashIcon height={16} width={16} className="text-fm-negative" />{' '}
					DELETE
				</Button>
			</DeleteModal>
		</div>
	)
}

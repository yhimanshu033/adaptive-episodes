import React from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

import { cn } from '@/lib/utils/helpers'

const SortableBeat = ({
	id,
	children,
	index,
}: React.PropsWithChildren<{ id: string; index: number }>) => {
	const {
		attributes,
		listeners,
		setNodeRef,
		setActivatorNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({ id })

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	}

	return (
		<div
			ref={setNodeRef}
			style={style}
			className={cn('relative rounded-md border p-3', {
				'opacity-0': isDragging,
			})}
		>
			<div
				key={id}
				ref={setActivatorNodeRef}
				{...listeners}
				{...attributes}
				className="mb-2 cursor-grab text-sm font-bold select-none"
			>
				BEAT {index + 1}
			</div>
			{children}
		</div>
	)
}

export default SortableBeat

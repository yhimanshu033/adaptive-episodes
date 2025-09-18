import React from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical } from 'lucide-react'

export function SortableScene({
	id,
	children,
}: React.PropsWithChildren<{ id: string }>) {
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		setActivatorNodeRef,
	} = useSortable({ id })

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	}

	return (
		<div ref={setNodeRef} style={style} className="mb-2 flex items-center">
			<div
				{...attributes}
				{...listeners}
				ref={setActivatorNodeRef}
				className="hover:text-foreground cursor-grab px-2 text-gray-500 transition-all"
			>
				<GripVertical size={18} />
			</div>
			<div className="flex-1">{children}</div>
		</div>
	)
}

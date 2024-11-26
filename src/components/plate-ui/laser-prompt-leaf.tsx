import React from 'react'
import { PlateLeaf, PlateLeafProps } from '@udecode/plate-common/react'

import { cn } from '@/lib/utils'

export default function LaserPromptLeaf({
	className,
	...props
}: PlateLeafProps) {
	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
	const { children } = props
	return (
		<PlateLeaf
			{...props}
			className={cn(
				'border-b-2 border-b-primary/40',
				'bg-primary/40',
				className
			)}
		>
			{children}
		</PlateLeaf>
	)
}

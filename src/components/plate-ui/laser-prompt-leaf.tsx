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
				// 'bg-blue-600/50',
				className
			)}
		>
			{children}
		</PlateLeaf>
	)
}

import React, { useEffect, useRef } from 'react'
import useLaserStore from '@/store/laser-store'
import { PlateLeaf, PlateLeafProps } from 'platejs/react'

import { cn } from '@/lib/utils/helpers'
import { getParentWidth } from '@/lib/utils/plate'

export default function LaserPromptLeaf({
	className,
	...props
}: PlateLeafProps) {
	const { store: laserStore, setPromptPosition } = useLaserStore()
	const { promptActive } = laserStore()
	const areaRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		const rect = areaRef.current?.getBoundingClientRect()

		const { blockAncestorContentWidth, blockAncestorClientX } =
			getParentWidth(areaRef)

		setPromptPosition({
			clientY: rect ? rect?.top + rect?.height : 0,
			clientX: blockAncestorClientX,
			width: blockAncestorContentWidth,
		})
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [promptActive])

	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
	const { children } = props
	return (
		<PlateLeaf
			{...props}
			className={cn(
				'border-b-primary/40 border-b-2',
				'bg-primary/40',
				className
			)}
			ref={areaRef}
		>
			{children}
		</PlateLeaf>
	)
}

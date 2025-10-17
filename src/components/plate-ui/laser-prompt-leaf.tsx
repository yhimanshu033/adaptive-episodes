import React, { useMemo, useRef } from 'react'
import { LASER_PROMPT_KEYS } from '@/constants/editor-constants'
import useLaserStore from '@/store/laser-store'
import { PlateLeaf, PlateLeafProps } from 'platejs/react'

import { cn } from '@/lib/utils/helpers'

export default function LaserPromptLeaf({
	className,
	leaf,
	...props
}: PlateLeafProps) {
	const { setPromptActive } = useLaserStore()
	const areaRef = useRef<HTMLDivElement>(null)

	const id = useMemo(() => {
		const keys = Object.keys(leaf)
		const idKey = keys.find((item) =>
			item.startsWith(LASER_PROMPT_KEYS.ID_START)
		)

		return idKey
	}, [leaf])

	if (!id) {
		return <>{props.children}</>
	}
	return (
		<PlateLeaf
			{...props}
			className={cn(
				'border-b-primary/40 border-b-2',
				'bg-primary/40',
				className
			)}
			leaf={leaf}
			ref={areaRef}
			attributes={{
				onClick: () => setPromptActive(id),
			}}
		>
			{props.children}
		</PlateLeaf>
	)
}

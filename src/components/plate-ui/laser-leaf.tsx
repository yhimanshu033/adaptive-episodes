/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import React, { useCallback } from 'react'
import { LASER_LEAF_KEYS } from '@/constants/editor-constants'
import useLaserStore from '@/store/laser-store'
import { cn } from '@udecode/cn'
import { Text } from 'platejs'
import { PlateLeaf, PlateLeafProps } from 'platejs/react'

function getLaserKey(elem: Text) {
	return Object.keys(elem).find((key) =>
		key.startsWith(LASER_LEAF_KEYS.ID_START)
	)
}

export const LaserLeaf = ({ className, ...props }: PlateLeafProps) => {
	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
	const { children, leaf } = props
	const key = getLaserKey(leaf)
	const { setActiveLaser } = useLaserStore()

	const handleClick = useCallback(() => {
		if (!key) {
			return
		}
		setActiveLaser(key)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [key])

	return (
		<PlateLeaf
			{...props}
			attributes={{
				onClick: handleClick,
			}}
			className={cn(
				'relative border-b-2 border-b-blue-500/70',
				'bg-blue-500/40',
				className
			)}
		>
			{children}
		</PlateLeaf>
	)
}

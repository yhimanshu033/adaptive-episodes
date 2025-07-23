'use client'

import React, { ReactNode, useState } from 'react'

import { cn } from '@/lib/aural-ui/utils'

interface MarqueeProps {
	children: ReactNode
	className?: string
	direction?: 'left' | 'right' | 'up' | 'down'
	pauseOnHover?: boolean
	speed?: number // Animation duration in seconds (higher = slower)
}

const Marquee: React.FC<MarqueeProps> = ({
	children,
	className = '',
	direction = 'left',
	pauseOnHover = false,
	speed = 20,
}) => {
	const [isPaused, setIsPaused] = useState(false)

	const isHorizontal = direction === 'left' || direction === 'right'

	return (
		<div
			className={` ${isHorizontal ? 'whitespace-nowrap' : ''}`}
			onMouseEnter={() => pauseOnHover && setIsPaused(true)}
			onMouseLeave={() => pauseOnHover && setIsPaused(false)}
		>
			<div
				className={cn(
					'marquee-container w-fit',
					isHorizontal ? 'flex' : 'block',
					className
				)}
				style={{
					animation: `marquee-${direction} ${speed}s linear infinite`,
					animationPlayState: isPaused ? 'paused' : 'running',
				}}
			>
				{children}
				{children}
			</div>
		</div>
	)
}

export default Marquee

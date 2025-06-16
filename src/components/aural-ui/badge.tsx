import React, { forwardRef } from 'react'

import { cn } from '../../lib/aural-ui/utils'
import { Tag } from './tag'

interface BadgeProps {
	children: React.ReactNode
	className?: string
	color?: 'neutral' | 'info' | 'positive' | 'negative' | 'warning'
	size?: 'xs' | 'sm' | 'md'
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
	({ children, color = 'neutral', className, size = 'md' }, ref) => {
		return (
			<Tag
				variant="system"
				color={color}
				className={cn('py-fm-sm px-fm-md leading-none', className)}
				size={size}
				ref={ref}
			>
				{children}
			</Tag>
		)
	}
)

Badge.displayName = 'Badge'

export default Badge

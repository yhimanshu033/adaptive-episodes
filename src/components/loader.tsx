import React from 'react'

import { cn } from '@/lib/utils'

export function Loader({
	loaderClass,
	text,
	textClass,
	size = 5,
}: {
	loaderClass?: string
	size?: number
	text?: string
	textClass?: string
}) {
	return (
		<>
			<div className={cn('flex gap-2', loaderClass)}>
				<div
					className={cn(
						`size-${size}`,
						'animate-pulse rounded-full bg-primary'
					)}
				/>
				<div
					className={cn(
						`size-${size}`,
						'animate-pulse rounded-full bg-primary'
					)}
				/>
				<div
					className={cn(
						`size-${size}`,
						'animate-pulse rounded-full bg-primary'
					)}
				/>
			</div>
			{text && <span className={cn('', textClass)}>{text}</span>}
		</>
	)
}

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

export function FullScreenLoader({
	className,
	...rest
}: {
	className?: string
	size?: number
	text?: string
	textClass?: string
}) {
	return (
		<div
			className={cn(
				'fixed inset-0 z-[100] flex min-h-screen w-full flex-col items-center justify-center gap-4 bg-background/90',
				className
			)}
		>
			<Loader {...rest} />
		</div>
	)
}

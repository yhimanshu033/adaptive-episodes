import React from 'react'

import { cn } from '@/lib/utils/helpers'

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
	text,
	loaderClass,
	textClass,
	size = 5,
}: {
	loaderClass?: string
	size?: number
	text?: string
	textClass?: string
}) {
	return (
		<div
			className={cn(
				'fixed inset-0 z-50 flex items-center justify-center bg-black/30'
			)}
		>
			<div className="flex flex-col items-center gap-2">
				<Loader
					loaderClass={loaderClass}
					text={text}
					textClass={textClass}
					size={size}
				/>
			</div>
		</div>
	)
}

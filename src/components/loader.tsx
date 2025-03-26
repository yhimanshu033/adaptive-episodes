import React from 'react'
import { LoaderCircle } from 'lucide-react'

import { buttonVariants } from '@/components/ui/button'
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
		<div className={cn('flex flex-col items-center gap-6', loaderClass)}>
			<div className="flex gap-2">
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
		</div>
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
				'fixed inset-0 z-[99] flex items-center justify-center bg-black/30'
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

export const IconLoader = () => {
	return (
		<div className={cn(buttonVariants({ variant: 'ghost', size: 'icon' }))}>
			<LoaderCircle className="animate-spin" size={16} />
		</div>
	)
}

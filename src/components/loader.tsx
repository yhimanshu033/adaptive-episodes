import React from 'react'
import { LoaderCircle } from 'lucide-react'

import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils/helpers'

import DotLoader from './aural-ui/dot-loader'

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
						'bg-primary animate-pulse rounded-full'
					)}
				/>
				<div
					className={cn(
						`size-${size}`,
						'bg-primary animate-pulse rounded-full'
					)}
				/>
				<div
					className={cn(
						`size-${size}`,
						'bg-primary animate-pulse rounded-full'
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
}: {
	loaderClass?: string
	text?: string
	textClass?: string
}) {
	return (
		<div
			className={cn(
				'fixed inset-0 z-99 flex items-center justify-center bg-black/30'
			)}
		>
			<div className="flex flex-col items-center gap-2">
				<DotLoader
					text={text}
					classes={{ text: textClass, dot: loaderClass }}
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

import React from 'react'
import { Portal } from '@radix-ui/react-portal'
import { LoaderCircle } from 'lucide-react'

import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils/helpers'

import DotLoader, { DotLoaderProps } from './aural-ui/dot-loader'
import { Overlay, OverlayProps } from './aural-ui/overlay'

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
	overlayProps,
	loaderProps,
}: {
	loaderProps?: DotLoaderProps
	overlayProps?: OverlayProps
}) {
	return (
		<Portal asChild>
			<Overlay
				classes={{
					root: 'z-600',
					wrapper: 'z-700',
				}}
				noise="none"
				{...overlayProps}
			>
				<DotLoader {...loaderProps} />
			</Overlay>
		</Portal>
	)
}

export const IconLoader = () => {
	return (
		<div className={cn(buttonVariants({ variant: 'ghost', size: 'icon' }))}>
			<LoaderCircle className="animate-spin" size={16} />
		</div>
	)
}

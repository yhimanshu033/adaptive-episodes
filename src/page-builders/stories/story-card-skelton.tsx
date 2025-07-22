import React from 'react'

import { Skeleton } from '@/components/aural-ui/skelton'

import { cn } from '../../lib/aural-ui/utils'

function StoryCardSkeleton({
	className,
	...props
}: React.ComponentProps<'div'>) {
	return (
		<div
			className={cn(
				'border-fm-divider-secondary bg-fm-surface-primary h-102 w-full max-w-77 overflow-hidden rounded border p-4',
				className
			)}
			{...props}
		>
			<div className="relative aspect-square">
				<Skeleton className="h-full w-full rounded-none" />

				<div className="absolute top-3 right-3 left-3 flex justify-between">
					<Skeleton className="h-6 w-28 rounded-sm" />
					<Skeleton className="h-6 w-20 rounded-sm" />
				</div>
			</div>

			<div className="mt-4 space-y-2">
				<Skeleton className="h-8 w-full" />

				<div className="flex items-center gap-2">
					<Skeleton className="h-4 w-24" />
					<Skeleton className="h-4 w-2 rounded-full" />
					<Skeleton className="h-4 w-20" />
				</div>

				<div className="flex items-center justify-between">
					<Skeleton className="h-4 w-32" />
					<Skeleton className="size-6 rounded-sm" />
				</div>
			</div>
		</div>
	)
}

function StoryCardGridSkeleton({
	count = 4,
	className,
	...props
}: {
	count?: number
} & React.ComponentProps<'div'>) {
	return (
		<div
			className={cn(
				'my-6 grid flex-1 grid-cols-1 justify-items-center gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
				className
			)}
			{...props}
		>
			{Array.from({ length: count }, (_, i) => (
				<StoryCardSkeleton key={i} />
			))}
		</div>
	)
}

export { StoryCardSkeleton, StoryCardGridSkeleton }

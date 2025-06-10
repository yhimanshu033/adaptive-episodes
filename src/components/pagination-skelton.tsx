import React from 'react'

import { Skeleton } from '@/components/aural-ui/skelton'
import { cn } from '@/lib/aural-ui/utils'

type IPaginationSkeletonProps = React.HTMLAttributes<HTMLDivElement>

const PaginationSkeleton = ({
	className,
	...props
}: IPaginationSkeletonProps) => {
	return (
		<div
			className={cn(
				'flex w-full items-center justify-between px-4 py-3',
				className
			)}
			{...props}
		>
			<div className="flex items-center gap-3">
				<Skeleton className="h-4 w-16" />

				<div className="relative">
					<Skeleton className="h-8 w-16 rounded border" />
				</div>
			</div>

			<div className="flex items-center gap-1">
				<Skeleton className="size-8 rounded" />

				<Skeleton className="size-8 rounded" />

				<div className="mx-2 flex items-center gap-1">
					<Skeleton className="bg-fm-surface-frosted/50 size-8 rounded" />

					<Skeleton className="size-8 rounded" />
					<Skeleton className="size-8 rounded" />
					<Skeleton className="size-8 rounded" />
					<Skeleton className="size-8 rounded" />
				</div>

				<Skeleton className="size-8 rounded" />

				<Skeleton className="size-8 rounded" />
			</div>
		</div>
	)
}

export default PaginationSkeleton

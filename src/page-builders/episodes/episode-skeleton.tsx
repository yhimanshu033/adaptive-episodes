import React from 'react'

import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

const SkeletonBuilder = ({
	count,
	containerClass,
	className,
}: {
	className?: string
	containerClass?: string
	count: number
}) => {
	return (
		<div className={cn('flex flex-col space-y-3', containerClass)}>
			{Array.from({ length: count }).map((_, index) => (
				<div key={index} className={cn('space-y-3 px-2')}>
					{index > 0 && <Separator />}
					<Skeleton className={cn(className)} />
				</div>
			))}
		</div>
	)
}

export default SkeletonBuilder

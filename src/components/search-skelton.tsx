import React from 'react'

import { Skeleton } from '@/components/aural-ui/skelton'
import { cn } from '@/lib/aural-ui/utils'

type ISearchSkeletonProps = React.HTMLAttributes<HTMLDivElement>

const SearchSkeleton = ({ className, ...props }: ISearchSkeletonProps) => {
	return (
		<div className={cn('mx-auto w-full', className)} {...props}>
			<div className="relative w-full">
				<div className="relative flex items-center">
					<div className="absolute left-4 z-10">
						<Skeleton className="size-5 rounded-full" />{' '}
					</div>
					<Skeleton className="h-12 w-full rounded-full pr-4 pl-12" />
				</div>
			</div>
		</div>
	)
}

export default SearchSkeleton

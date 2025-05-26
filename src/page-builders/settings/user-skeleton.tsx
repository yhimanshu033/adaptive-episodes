import React from 'react'

import { Skeleton } from '@/components/ui/skeleton'

export default function UserInfoSkeleton() {
	return (
		<div className="bg-background-editor flex items-center space-x-4 rounded-lg p-4">
			<Skeleton className="size-20" />
			<div className="flex w-full flex-col gap-2">
				<Skeleton className="h-8 w-3/4" />
				<Skeleton className="h-6 w-4/5" />
			</div>
		</div>
	)
}

import React from 'react'

import { Divider } from '@/components/aural-ui/divider'
import { Skeleton } from '@/components/aural-ui/skelton'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/aural-ui/table'

const EpisodesTableSkeleton = () => {
	return (
		<>
			<div className="mb-4 flex items-center justify-between">
				<div className="flex items-center gap-3">
					<Skeleton className="size-10 rounded-full" />
					<div className="space-y-2">
						<Skeleton className="h-6 w-32" />
						<Skeleton className="h-4 w-24" />
					</div>
				</div>
				<div className="flex items-center gap-2">
					<Skeleton className="h-11 w-64" />
					<Skeleton className="h-11 w-11" />
					<Skeleton className="h-11 w-20" />
				</div>
			</div>
			<Divider className="mt-4 mb-10" variant="secondary" />
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead className="w-12">
							<Skeleton className="h-6 w-6" />
						</TableHead>
						<TableHead className="w-16">
							<Skeleton className="h-6 w-full" />
						</TableHead>
						<TableHead>
							<Skeleton className="h-6 w-full" />
						</TableHead>
						<TableHead className="w-24">
							<Skeleton className="h-6 w-20" />
						</TableHead>
						<TableHead className="w-32">
							<Skeleton className="h-6 w-16" />
						</TableHead>
						<TableHead className="w-40">
							<Skeleton className="h-6 w-16" />
						</TableHead>
						<TableHead className="w-32">
							<Skeleton className="h-6 w-24" />
						</TableHead>
						<TableHead className="w-20">
							<Skeleton className="h-6 w-16" />
						</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{Array.from({ length: 10 }).map((_, index) => (
						<TableRow key={index}>
							<TableCell>
								<Skeleton className="h-6 w-6" />
							</TableCell>
							<TableCell>
								<Skeleton className="h-6 w-8" />
							</TableCell>
							<TableCell>
								<Skeleton className="h-6 w-full" />
							</TableCell>
							<TableCell>
								<Skeleton className="h-6 w-16" />
							</TableCell>
							<TableCell>
								<Skeleton className="h-6 w-20 rounded-full" />
							</TableCell>
							<TableCell>
								<Skeleton className="h-6 w-32" />
							</TableCell>
							<TableCell>
								<Skeleton className="h-6 w-20" />
							</TableCell>
							<TableCell className="text-right">
								<Skeleton className="inline-block h-6 w-6" />
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</>
	)
}

export default EpisodesTableSkeleton

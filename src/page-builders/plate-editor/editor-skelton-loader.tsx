import React from 'react'

import { Skeleton } from '@/components/aural-ui/skelton'

function EditorSkeletonLoader() {
	return (
		<div className="border-fm-divider-secondary mb-4 flex h-[calc(100vh-20px)] flex-col border-r border-b border-l bg-black text-white">
			{/* Header */}
			<div className="border-fm-divider-secondary flex h-22 items-center justify-between border-b p-4">
				<div className="flex items-center gap-4">
					<Skeleton className="h-8 w-8" />
					<Skeleton className="h-8 w-8" />
					<Skeleton className="h-6 w-20" />
					<Skeleton className="h-6 w-24" />
				</div>
				<div className="flex items-center gap-2">
					<Skeleton className="h-8 w-20" />
					<Skeleton className="h-8 w-16" />
					<Skeleton className="h-8 w-20" />
				</div>
			</div>
			<div className="flex flex-1 overflow-hidden">
				{/* Main Editor Area */}
				<div className="flex flex-1 flex-col">
					{/* Toolbar */}
					<div className="border-fm-divider-secondary flex h-16 items-center gap-2 border-b p-3">
						<Skeleton className="h-8 w-8" />
						<Skeleton className="h-8 w-8" />
						<Skeleton className="h-8 w-8" />
						<Skeleton className="h-6 w-12" />
						<Skeleton className="h-6 w-16" />
						<div className="flex gap-1">
							<Skeleton className="h-6 w-6" />
							<Skeleton className="h-6 w-6" />
							<Skeleton className="h-6 w-6" />
						</div>
						<Skeleton className="h-6 w-8" />
						<Skeleton className="h-6 w-8" />
						<Skeleton className="h-6 w-8" />
						<Skeleton className="h-8 w-8" />
						<Skeleton className="h-8 w-8" />
						<Skeleton className="h-8 w-8" />
						<div className="ml-auto flex gap-2">
							<Skeleton className="h-6 w-20" />
							<Skeleton className="h-6 w-24" />
						</div>
					</div>

					{/* Editor Content */}
					<div className="flex-1 p-6">
						<div className="max-w-4xl space-y-4">
							<Skeleton className="h-4 w-full" />
							<Skeleton className="h-4 w-3/4" />
							<Skeleton className="h-4 w-1/2" />
							<div className="mt-8">
								<Skeleton className="h-4 w-16" />
							</div>
						</div>
					</div>
				</div>

				{/* Right Sidebar - StoryChat */}
				<div className="border-fm-divider-secondary flex w-80 flex-col border-l">
					{/* Chat Header */}
					<div className="border-fm-divider-secondary border-b p-4">
						<div className="mb-4 flex items-center justify-between">
							<Skeleton className="h-6 w-20" />
							<Skeleton className="h-6 w-24" />
						</div>

						{/* AI Assistant Message */}
						<div className="mb-4 flex items-start gap-3">
							<Skeleton className="h-8 w-8 rounded-full" />
							<div className="flex-1 space-y-2">
								<Skeleton className="h-4 w-full" />
								<Skeleton className="h-4 w-3/4" />
							</div>
						</div>

						{/* Action Buttons */}
						<div className="mb-4 flex flex-wrap gap-2">
							<Skeleton className="h-8 w-20 rounded-full" />
							<Skeleton className="h-8 w-24 rounded-full" />
							<Skeleton className="h-8 w-18 rounded-full" />
							<Skeleton className="h-8 w-22 rounded-full" />
							<Skeleton className="h-8 w-20 rounded-full" />
						</div>
					</div>

					{/* Chat Input */}
					<div className="border-fm-divider-secondary mt-auto border-t p-4">
						<div className="flex items-center gap-2">
							<Skeleton className="h-10 flex-1 rounded-lg" />
							<Skeleton className="h-10 w-10" />
							<Skeleton className="h-10 w-10" />
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export { EditorSkeletonLoader }

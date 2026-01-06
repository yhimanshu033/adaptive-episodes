'use client'

import React from 'react'

import { Button } from '@/components/aural-ui/button'
import { ScrollArea } from '@/components/aural-ui/scroll-area'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/aural-ui/utils'

import { TEpisodeProgressStatus } from '../lib/types'
import useStoryExpansion from '../provider'

function getStatusLabel(status: TEpisodeProgressStatus): string {
	switch (status) {
		case 'pending':
			return 'Pending'
		case 'generating':
			return 'Generating...'
		case 'completed':
			return 'Completed'
		case 'cancelled':
			return 'Cancelled'
		default:
			return 'Unknown'
	}
}

function getStatusColor(status: TEpisodeProgressStatus): string {
	switch (status) {
		case 'pending':
			return 'text-fm-tertiary'
		case 'generating':
			return 'text-fm-primary'
		case 'completed':
			return 'text-fm-success'
		case 'cancelled':
			return 'text-fm-error'
		default:
			return 'text-fm-tertiary'
	}
}

export default function ProgressTab() {
	const { episodeProgresses, handleStopAllGeneration, handleGoToNewEpisode } =
		useStoryExpansion()

	if (!episodeProgresses || episodeProgresses.length === 0) {
		return (
			<div className="flex h-full items-center justify-center">
				<p className="text-fm-md text-fm-tertiary">
					No episodes in progress. Generate episodes from the Review tab.
				</p>
			</div>
		)
	}

	const hasGenerating = episodeProgresses.some(
		(p) => p.status === 'generating' || p.status === 'pending'
	)
	const allCompleted = episodeProgresses.every((p) => p.status === 'completed')
	const hasCompleted = episodeProgresses.some((p) => p.status === 'completed')

	return (
		<div className="flex h-full flex-col overflow-hidden">
			<div className="border-fm-divider-primary flex flex-col border-b p-6">
				<div className="flex items-center justify-between">
					<div>
						<h3 className="text-fm-2xl font-fm-brand text-fm-primary">
							Episode Generation Progress
						</h3>
						<p className="text-fm-md text-fm-tertiary mt-2">
							Track the progress of each episode being generated
						</p>
					</div>
					{hasGenerating && (
						<Button
							onClick={handleStopAllGeneration}
							variant="secondary"
							size="sm"
						>
							Stop All
						</Button>
					)}
					{allCompleted && hasCompleted && (
						<Button
							onClick={() => {
								// Use the first completed episode ID (dummy for now)
								const firstCompleted = episodeProgresses.find(
									(p) => p.status === 'completed'
								)
								if (firstCompleted) {
									handleGoToNewEpisode(firstCompleted.episodeId)
								}
							}}
							variant="primary"
							size="sm"
						>
							Go to New Episode
						</Button>
					)}
				</div>
			</div>

			<ScrollArea className="flex-1">
				<div className="flex flex-col gap-4 p-6">
					{episodeProgresses.map((progress) => (
						<div
							key={progress.episodeId}
							className="border-fm-divider-primary border p-4"
						>
							<div className="mb-3 flex items-center justify-between">
								<div className="flex-1">
									<div className="flex items-center gap-2">
										<p className="text-fm-lg text-fm-primary font-medium">
											{progress.episodeName}
										</p>
										<span
											className={cn(
												'text-fm-xs rounded-full px-2 py-0.5',
												getStatusColor(progress.status)
											)}
										>
											{getStatusLabel(progress.status)}
										</span>
									</div>
									<p className="text-fm-sm text-fm-tertiary mt-1">
										{progress.arcName}
									</p>
								</div>
							</div>

							{progress.status === 'generating' && (
								<div className="mb-3">
									<Progress value={progress.progress} className="h-2" />
									<p className="text-fm-xs text-fm-tertiary mt-1 text-right">
										{progress.progress}%
									</p>
								</div>
							)}
						</div>
					))}
				</div>
			</ScrollArea>
		</div>
	)
}

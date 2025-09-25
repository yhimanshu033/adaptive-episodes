'use client'

import React from 'react'
import { AlertTriangle, Clock } from 'lucide-react'

import CircularLoader from '@/components/aural-ui/circular-loader'
import IfElse from '@/components/if-else'

interface GenerationStatusBarProps {
	generatingSceneIds: string[]
	hasTimeoutError: boolean
	isPending: boolean
	remainingTime: number | null
	totalScenes: number
}

export default function GenerationStatusBar({
	generatingSceneIds,
	hasTimeoutError,
	isPending,
	remainingTime,
	totalScenes,
}: GenerationStatusBarProps) {
	if (!isPending && !hasTimeoutError) {
		return null
	}

	const isGeneratingAll = generatingSceneIds.length === totalScenes
	const statusMessage = isPending
		? `Generating ${isGeneratingAll ? 'All Scenes' : `${generatingSceneIds.length} Scene(s)`}...`
		: 'Generation timed out - please try again'

	return (
		<div className="bg-fm-surface-primary rounded-fm-l border-fm-divider-primary mb-4 border p-3">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-2">
					<IfElse
						condition={isPending}
						if={<CircularLoader className="h-4 w-4" />}
						else={<AlertTriangle className="text-fm-warning h-4 w-4" />}
					/>
					<IfElse
						condition={hasTimeoutError}
						if={
							<span className="text-fm-warning text-sm font-medium">
								{statusMessage}
							</span>
						}
						else={<span className="text-sm font-medium">{statusMessage}</span>}
					/>
				</div>
				<IfElse
					condition={remainingTime !== null && isPending}
					if={
						<div className="text-fm-tertiary flex items-center gap-1">
							<Clock className="h-3 w-3" />
							<span className="text-xs">{remainingTime}s remaining</span>
						</div>
					}
				/>
			</div>
		</div>
	)
}

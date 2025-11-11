import React from 'react'
import { StopIcon } from '@/icons/stop-icon'
import useOutliner from '@/page-builders/plate-editor/sidebar-sections/outliner/provider'

import { IconButton } from '@/components/aural-ui/icon-button'
import ForEach from '@/components/ui/for-each'
import { ProgressLoading } from '@/components/ui/progress-loading'

const displayArray = [
	'Content Generation Started...',
	'Outlining the structure',
]

export default function OutlinerSummaryEpGeneration() {
	const { summaryEpisodeTaskId, handleCompleteContentGeneration } =
		useOutliner()

	return (
		<div className="text-xs">
			<h4 className="animate-gradient-slide bg-clip-text text-transparent">
				Generating Content:
			</h4>
			<ProgressLoading
				className="mt-1 mb-2 h-1"
				time={3 * 60 * 1000}
				stopAt={95}
				persistKey={summaryEpisodeTaskId}
			/>
			<ForEach data={displayArray}>
				{(item, idx) => {
					return (
						<p key={`generation-log-${idx}`} className="animate-fade-in-up">
							{item}
						</p>
					)
				}}
			</ForEach>
			<div className="flex justify-end">
				<IconButton
					label="Stop Generation"
					tooltip="Stop Generation"
					icon={<StopIcon />}
					size="small"
					variant="ghost"
					onClick={() => {
						void handleCompleteContentGeneration({ accepted: false })
					}}
				/>
			</div>
		</div>
	)
}

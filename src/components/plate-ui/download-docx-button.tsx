import React from 'react'
import useDocxDownloadHook from '@/hooks/mutation/use-docx-download-hook'
import { Download } from 'lucide-react'

import { DownloadDocxParams } from '@/types/episode-type'

import { IconButton } from '../aural-ui/icon-button'
import CircularLoader from '../ui/circular-loader'

export default function DownloadDocxButton({
	latestStatus,
}: DownloadDocxParams) {
	const { isPending, showButton, mutate } = useDocxDownloadHook({
		latestStatus,
	})
	return (
		showButton && (
			<IconButton
				variant="outlined"
				disabled={isPending}
				tooltip="Download"
				shape="square"
				onClick={() => mutate()}
				label="Download Docx"
				className="size-7 shrink-0"
				icon={
					isPending ? (
						<CircularLoader className="size-4" />
					) : (
						<Download className="size-4" />
					)
				}
				tooltipContentProps={{
					side: 'bottom',
					align: 'center',
				}}
			/>
		)
	)
}

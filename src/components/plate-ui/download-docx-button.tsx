import React from 'react'
import useDocxDownloadHook from '@/hooks/mutation/use-docx-download-hook'

import { DownloadDocxParams } from '@/types/episode-type'

import { Button } from '../aural-ui/button'
import CircularLoader from '../ui/circular-loader'

export default function DownloadDocxButton({
	latestStatus,
}: DownloadDocxParams) {
	const { isPending, showButton, mutate } = useDocxDownloadHook({
		latestStatus,
	})
	return (
		showButton && (
			<Button
				variant="outline"
				disabled={isPending}
				tooltip="Download"
				tooltipContentProps={{
					side: 'bottom',
					align: 'end',
				}}
				isDisabled={isPending}
				size="sm"
				className="group"
				innerClassName="font-fm-brand border-fm-divider-secondary group-hover:border-fm-divider-contrast group-disabled:translate-y-0 group-disabled:hover:border-fm-divider-secondary "
				onClick={() => mutate()}
			>
				{isPending ? <CircularLoader className="size-4" /> : null}
				Download
			</Button>
		)
	)
}

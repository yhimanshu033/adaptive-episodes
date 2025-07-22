import React from 'react'
import useDocxDownloadHook from '@/hooks/mutation/use-docx-download-hook'
import { Download } from 'lucide-react'

import { Button } from '@/components/ui/button'
import Spinner from '@/components/ui/spinner'

import { DownloadDocxParams } from '@/types/episode-type'

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
				className="px-2"
				tooltip="Download"
				onClick={() => mutate()}
			>
				{isPending ? <Spinner size={16} /> : <Download size={16} />}
			</Button>
		)
	)
}

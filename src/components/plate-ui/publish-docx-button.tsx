import React from 'react'
import usePublishDocxHook from '@/hooks/mutation/use-publish-docx-hook'
import { Upload } from 'lucide-react'

import { Button } from '@/components/ui/button'
import Spinner from '@/components/ui/spinner'

import { DownloadDocxParams } from '@/types/episode-type'

export default function UploadDocxButton({ latestStatus }: DownloadDocxParams) {
	const { isPending, showButton, mutate } = usePublishDocxHook({
		latestStatus,
	})

	if (!showButton) {
		return null
	}

	return (
		<Button
			variant="outline"
			disabled={isPending}
			className="px-2"
			tooltip="Upload to Google Drive"
			onClick={() => mutate()}
		>
			{isPending ? <Spinner size={16} /> : <Upload size={16} />}
		</Button>
	)
}

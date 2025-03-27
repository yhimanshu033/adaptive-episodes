import React from 'react'
import usePublishDocxHook from '@/hooks/mutation/use-publish-docx-hook'
import { Upload } from 'lucide-react'

import IfElse from '@/components/if-else'
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
			<IfElse
				condition={isPending}
				if={<Spinner size={16} />}
				else={<Upload size={16} />}
			/>
		</Button>
	)
}

import React, { useCallback } from 'react'
import { DownloadIcon } from '@/icons/download-icon'
import { toast } from 'sonner'

import { IconButton } from '@/components/aural-ui/icon-button'
import { Typography } from '@/components/aural-ui/typography'
import usePlayer from '@/providers/player-provider'
import { downloadBlobUrl } from '@/lib/utils/client-helpers'

export default function PlayerInfo() {
	const { playingEpisode, audioRef } = usePlayer()

	const info = playingEpisode?.info

	const handleDownload = useCallback(() => {
		if (!audioRef.current) {
			return toast.error('Audio not found!')
		}
		const src = audioRef.current?.src
		downloadBlobUrl(src, `${info?.chapter} - ${info?.episode}.mp3`)
	}, [info, audioRef])

	if (!info) {
		return null
	}

	return (
		<div className="flex w-full items-center justify-between">
			<div>
				<Typography variant="caption-medium" as="h4" weight="medium">
					{info.episode}
				</Typography>
				<Typography as="h5" variant="caption-small" color="secondary">
					{info.chapter}
				</Typography>
			</div>
			<IconButton
				label="Download Audio"
				tooltip="Download"
				variant="ghost"
				shape="square"
				size="small"
				icon={<DownloadIcon />}
				onClick={handleDownload}
			/>
		</div>
	)
}

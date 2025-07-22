import React, { useCallback } from 'react'
import { Download } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
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
		<div className="flex w-full justify-between">
			<div>
				<h4 className="text-sm font-medium">{info.episode}</h4>
				<h5 className="text-muted-foreground text-xs font-light">
					{info.chapter}
				</h5>
			</div>
			<Button
				tooltip="Download"
				variant="ghost"
				size="icon"
				onClick={handleDownload}
			>
				<Download />
			</Button>
		</div>
	)
}

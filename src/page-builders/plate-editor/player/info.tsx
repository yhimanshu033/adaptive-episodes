import React, { useCallback } from 'react'
import { Download } from 'lucide-react'

import { Button } from '@/components/ui/button'
import usePlayer from '@/providers/player-provider'
import { downloadBlobUrl } from '@/lib/utils/client-helpers'

export default function PlayerInfo() {
	const { playingEpisode } = usePlayer()

	const info = playingEpisode?.info
	const src = playingEpisode?.src

	const handleDownload = useCallback(() => {
		if (!src) return

		downloadBlobUrl(src, `${info?.chapter}-${info?.episode}.mp3`)
	}, [src, info])

	if (!info) {
		return null
	}

	return (
		<div className="flex w-full justify-between">
			<div>
				<h4 className="text-sm font-medium">{info.episode}</h4>
				<h5 className="text-xs font-light text-muted-foreground">
					{info.chapter}
				</h5>
			</div>
			<Button variant="ghost" size="icon" onClick={handleDownload}>
				<Download />
			</Button>
		</div>
	)
}

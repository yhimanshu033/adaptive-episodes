import React from 'react'

import { TPlayingEpisode } from '@/types/episode-type'

export default function PlayerInfo({
	info,
}: {
	info: TPlayingEpisode['info']
}) {
	return (
		<div>
			<h4 className="text-sm font-medium">{info.episode}</h4>
			<h5 className="text-xs font-light text-muted-foreground">
				{info.chapter}
			</h5>
		</div>
	)
}

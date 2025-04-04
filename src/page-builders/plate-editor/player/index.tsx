'use'

import React from 'react'
import PlayerAudio from '@/page-builders/plate-editor/player/audio'
import PlayerInfo from '@/page-builders/plate-editor/player/info'

import usePlayer from '@/providers/player-provider'

export default function Player() {
	const { playingEpisode } = usePlayer()

	if (!playingEpisode) {
		return null
	}

	return (
		<div className="group fixed bottom-4 right-4 z-20 opacity-75 transition-opacity hover:opacity-100">
			<div>
				<PlayerAudio src={playingEpisode.src} info={playingEpisode.info} />
				<PlayerInfo info={playingEpisode.info} />
			</div>
		</div>
	)
}

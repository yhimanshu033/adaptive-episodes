import React from 'react'
import PlayerAudio from '@/page-builders/plate-editor/player/audio'

export default function Player() {
	return (
		<div className="group fixed bottom-4 right-4 z-20 opacity-75 transition-opacity hover:opacity-100">
			<PlayerAudio />
		</div>
	)
}

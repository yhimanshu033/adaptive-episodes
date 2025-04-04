'use client'

import React, { createContext, useContext, useState } from 'react'

import { TPlayingEpisode } from '@/types/episode-type'

function usePlayerUtil() {
	const [playingEpisode, setPlayingEpisode] = useState<TPlayingEpisode | null>(
		null
	)

	return {
		playingEpisode,
		setPlayingEpisode,
	}
}

const PlayerContext = createContext<ReturnType<typeof usePlayerUtil> | null>(
	null
)

export function PlayerProvider({ children }: { children: React.ReactNode }) {
	const value = usePlayerUtil()

	return (
		<PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>
	)
}

export default function usePlayer() {
	const context = useContext(PlayerContext)
	if (!context) {
		throw new Error('usePlayer must be used within a PlayerProvider')
	}
	return context
}

'use client'

import React, { createContext, ReactNode, useContext } from 'react'
import { EpisodeContentProvider } from '@/hooks/query/use-episode-content'
import { create, StoreApi, UseBoundStore } from 'zustand'
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { useShallow } from 'zustand/react/shallow'

import { EDualVIewMode, EpisodeIdStoreType } from '@/types/episode-type'

const initialEpisodeIdState: EpisodeIdStoreType = {
	episodeId: 0,
	selectedStatus: undefined,
	activeNoteId: null,
	resolvedComments: [],
	currentTitle: '',
	dualViewMode: EDualVIewMode.US_TRANSLATION,
	startOverlayLoading: false,
	selectedLanguage: undefined,
	importedLocal: false,
	acceptedDiffValue: null,
	recentEmail: '',
	currentLLMMemories: {},
}

type EpisodeIdContextType = {
	useEpisodeIdStoreContext: UseBoundStore<StoreApi<EpisodeIdStoreType>>
}

const EpisodeIdContext = createContext<EpisodeIdContextType>({
	useEpisodeIdStoreContext: create(() => initialEpisodeIdState),
})

export function EpisodeIdProvider({
	children,
	episodeId: defaultEpisodeId,
}: {
	children: ReactNode
	episodeId: number
}) {
	const useEpisodeIdStoreContext = create(
		devtools(
			immer(() => ({ ...initialEpisodeIdState, episodeId: defaultEpisodeId }))
		)
	)
	return (
		<EpisodeIdContext.Provider
			value={{
				useEpisodeIdStoreContext,
			}}
		>
			<EpisodeContentProvider>{children}</EpisodeContentProvider>
		</EpisodeIdContext.Provider>
	)
}

export const useEpisodeContext = () => {
	return useContext(EpisodeIdContext)
}

const useEpisodeId = () => {
	const { useEpisodeIdStoreContext } = useContext(EpisodeIdContext)
	const episodeId = useEpisodeIdStoreContext(
		useShallow((state) => state.episodeId)
	)
	return episodeId
}

export default useEpisodeId

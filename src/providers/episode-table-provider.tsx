'use client'

import React, { createContext, useContext, useRef } from 'react'
import { useStoryIdData } from '@/hooks/query/use-story-data'
import { create, StoreApi, UseBoundStore } from 'zustand'
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

import { EpisodeStoreState } from '@/types/episode-type'

const initialState: EpisodeStoreState = {
	currentPage: 1,
	episodeSearch: '',
	isDialogOpen: false,
	isInventOpen: false,
	statusUpdating: [],
	isSharedAccessDialogOpen: false,
	alertInfo: null,
	deleteEpisodeId: null,
	selectedEpisodes: null,
	currentInventIndex: null,
	notes: [],
}

type EpisodeStore = UseBoundStore<StoreApi<EpisodeStoreState>>

function useEpisodeContextUtil() {
	// Use useRef to ensure the store is only created once per provider instance
	// This prevents store recreation when useQuery hooks trigger re-renders
	const storeRef = useRef<EpisodeStore | null>(null)

	if (!storeRef.current) {
		storeRef.current = create(
			devtools(immer(() => initialState))
		) as EpisodeStore
	}

	const { data, isFetching } = useStoryIdData()

	return {
		useEpisodeStoreUtil: storeRef.current,
		initialStoryData: data,
		storyDataFetching: isFetching,
	}
}

const EpisodeTableContext = createContext<ReturnType<
	typeof useEpisodeContextUtil
> | null>(null)

export function EpisodeTableProvider({
	children,
}: {
	children: React.ReactNode
}) {
	const value = useEpisodeContextUtil()
	return (
		<EpisodeTableContext.Provider value={value}>
			{children}
		</EpisodeTableContext.Provider>
	)
}

export default function useEpisodeTableContext() {
	const context = useContext(EpisodeTableContext)
	if (!context) {
		throw new Error(
			'useEpisodeTableContext must be used within a EpisodeTableProvider'
		)
	}
	return context
}

'use client'

import React, { createContext, useContext } from 'react'
import { useStoryIdData } from '@/hooks/query/use-story-data'
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

import { EpisodeStoreState } from '@/types/episode-type'

const initialState: EpisodeStoreState = {
	currentPage: 1,
	episodeSearch: '',
	isDialogOpen: false,
	isInventOpen: false,
	alertInfo: null,
	deleteEpisodeId: null,
	selectedEpisodes: null,
	currentInventIndex: null,
	notes: [],
}

function useEpisodeContextUtil() {
	const useEpisodeStoreUtil = create(devtools(immer(() => initialState)))

	const { data } = useStoryIdData()

	return {
		useEpisodeStoreUtil,
		initialStoryData: data,
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

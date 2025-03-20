'use client'

import React, { createContext, useContext, useMemo } from 'react'
import { useParams } from 'next/navigation'
import { useStoriesData } from '@/hooks/query/use-story-data'
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

	const { id } = useParams()
	const { data } = useStoriesData()

	const initialStoryData = useMemo(
		() => data?.find((story) => story.id === parseInt(id as string)),
		[data, id]
	)

	return {
		useEpisodeStoreUtil,
		initialStoryData,
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

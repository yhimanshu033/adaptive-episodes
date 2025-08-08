'use client'

import React, { createContext, ReactNode, useContext } from 'react'
import { DEFAULT_FONT_FAMILY } from '@/constants/editor-constants'
import { ExplorerModeId } from '@/constants/story-explorer-constants'
import { EpisodeContentProvider } from '@/hooks/query/use-episode-content'
import { create, StoreApi, UseBoundStore } from 'zustand'
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { useShallow } from 'zustand/react/shallow'

import { AIStoreType, EFocusSetting } from '@/types/ai-types'
import { EDualVIewMode, EpisodeIdStoreType } from '@/types/episode-type'
import { ESidebar, LaserStoreType, PlateStoreData } from '@/types/plate-types'

const initialState: PlateStoreData = {
	sidebar: ESidebar.CHATBOT,
	resolved: false,
	scale: 1,
	activeDiffId: null,
	diffIdList: [],
	currentDiffValue: null,
	viewMode: false,
	fontFamily: DEFAULT_FONT_FAMILY,
	localDiffValue: null,
	focusMode: false,
}

const initialAiState: AIStoreType = {
	messages: [],
	responseValue: null,
	prevValue: null,
	requestedAction: null,
	activeExplorerMode: ExplorerModeId.Plot,
	activeExplorerActions: {
		[ExplorerModeId.Character]: null,
		[ExplorerModeId.Plot]: null,
		[ExplorerModeId.World]: null,
	},
	activeCommentExampleMap: {},
	storyExplorerConfiguration: {
		current_ep: true,
		next_eps: false,
		prev_eps: false,
	},
	inputFocus: null,
	explorerFocusConfig: EFocusSetting.CMS,
}

const initialLaserState: LaserStoreType = {
	lasers: {},
	promptActive: null,
	active: null,
	responseActive: null,
}

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
}

type EpisodeIdContextType = {
	useAiStoreContext: UseBoundStore<StoreApi<AIStoreType>>
	useEpisodeIdStoreContext: UseBoundStore<StoreApi<EpisodeIdStoreType>>
	useLaserContext: UseBoundStore<StoreApi<LaserStoreType>>
	usePlateStoreContext: UseBoundStore<StoreApi<PlateStoreData>>
}

const EpisodeIdContext = createContext<EpisodeIdContextType>({
	useEpisodeIdStoreContext: create(() => initialEpisodeIdState),
	usePlateStoreContext: create(() => initialState),
	useAiStoreContext: create(() => initialAiState),
	useLaserContext: create(() => initialLaserState),
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

	const usePlateStoreContext = create(devtools(immer(() => initialState)))

	const useAiStoreContext = create(devtools(immer(() => initialAiState)))

	const useLaserContext = create(
		devtools(immer<LaserStoreType>(() => initialLaserState))
	)

	return (
		<EpisodeIdContext.Provider
			value={{
				useEpisodeIdStoreContext,
				usePlateStoreContext,
				useAiStoreContext,
				useLaserContext,
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

'use client'

import React, { createContext, ReactNode, useContext } from 'react'
import { aiInitialMessage } from '@/constants/ai-constants'
import { DEFAULT_FONT_FAMILY } from '@/constants/editor-constants'
import { ExplorerModeId } from '@/constants/story-explorer-constants'
import { EpisodeContentProvider } from '@/hooks/query/use-episode-content'
import { useTranslations } from 'next-intl'
import { create, StoreApi, UseBoundStore } from 'zustand'
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { useShallow } from 'zustand/react/shallow'

import { AIStoreType, EFocusSetting } from '@/types/ai-types'
import { EDualVIewMode, EpisodeIdStoreType } from '@/types/episode-type'
import { LaserStoreType, PlateStoreData } from '@/types/plate-types'

const initialState: PlateStoreData = {
	sidebar: null,
	resolved: false,
	scale: 1,
	activeDiffId: null,
	currentDiffValue: null,
	viewMode: false,
	fontFamily: DEFAULT_FONT_FAMILY,
	localDiffValue: null,
	focusMode: false,
}

const initialAiState: AIStoreType = {
	messages: aiInitialMessage,
	responseValue: null,
	prevValue: null,
	acceptedValue: null,
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
	const dict = useTranslations('placeholders')
	const useEpisodeIdStoreContext = create(
		devtools(
			immer(() => ({ ...initialEpisodeIdState, episodeId: defaultEpisodeId }))
		)
	)

	const usePlateStoreContext = create(devtools(immer(() => initialState)))

	initialAiState.messages[0].content = dict('initialAiMessage')

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

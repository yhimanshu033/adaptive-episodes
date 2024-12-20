'use client'

import React, {
	createContext,
	Dispatch,
	ReactNode,
	SetStateAction,
	useContext,
	useState,
} from 'react'
import { aiInitialMessage } from '@/constants/ai-constants'
import { create, StoreApi, UseBoundStore } from 'zustand'
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

import { AIStoreType } from '@/types/ai-types'
import { EStatus } from '@/types/common'
import { LaserStoreType, PlateStoreData } from '@/types/plate-types'

const initialState: PlateStoreData = {
	sidebar: null,
	resolved: false,
	scale: 1,
	activeDiffId: null,
	currentDiffValue: null,
}

const initialAiState: AIStoreType = {
	messages: aiInitialMessage,
	responseValue: null,
	prevValue: null,
	acceptedValue: null,
}

const initialLaserState: LaserStoreType = {
	lasers: {},
	promptActive: null,
	active: null,
	responseActive: null,
}

type EpisodeIdContextType = {
	episodeId: number
	selectedStatus: EStatus | undefined
	setEpisodeId: Dispatch<SetStateAction<number>>
	setSelectedStatus: Dispatch<SetStateAction<EStatus | undefined>>
	useAiStoreContext: UseBoundStore<StoreApi<AIStoreType>>
	useLaserContext: UseBoundStore<StoreApi<LaserStoreType>>
	usePlateStoreContext: UseBoundStore<StoreApi<PlateStoreData>>
}

const EpisodeIdContext = createContext<EpisodeIdContextType>({
	episodeId: 0,
	setEpisodeId: () => {},
	selectedStatus: undefined,
	setSelectedStatus: () => {},
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
	const [episodeId, setEpisodeId] = useState<number>(defaultEpisodeId)

	const [selectedStatus, setSelectedStatus] = useState<EStatus | undefined>()

	const usePlateStoreContext = create(devtools(immer(() => initialState)))

	const useAiStoreContext = create(devtools(immer(() => initialAiState)))

	const useLaserContext = create(
		devtools(immer<LaserStoreType>(() => initialLaserState))
	)

	return (
		<EpisodeIdContext.Provider
			value={{
				episodeId,
				setEpisodeId,
				selectedStatus,
				setSelectedStatus,
				usePlateStoreContext,
				useAiStoreContext,
				useLaserContext,
			}}
		>
			{children}
		</EpisodeIdContext.Provider>
	)
}

export const useEpisodeContext = () => {
	return useContext(EpisodeIdContext)
}

const useEpisodeId = () => {
	const { episodeId } = useContext(EpisodeIdContext)
	return episodeId
}

export default useEpisodeId

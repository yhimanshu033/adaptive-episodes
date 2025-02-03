'use client'

import React, { createContext, useContext } from 'react'
import { create, StoreApi, UseBoundStore } from 'zustand'
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

import { EditorExtendedStore } from '@/types/editor-types'

const initialExtendedState: EditorExtendedStore = {
	episodeMap: {},
	extended: [],
}

type EditorExtendedState = {
	useEpisodeExtendedStoreUtil: UseBoundStore<StoreApi<EditorExtendedStore>>
}
const EditorExtendedContext = createContext<EditorExtendedState>({
	useEpisodeExtendedStoreUtil: create(() => initialExtendedState),
})

export const EditorExtendedStateProvider = ({
	children,
	episodeId,
}: {
	children: React.ReactNode
	episodeId: number
}) => {
	const initialExtendedState: EditorExtendedStore = {
		episodeMap: {},
		extended: [episodeId],
	}
	const useEpisodeExtendedStoreUtil = create(
		devtools(immer(() => initialExtendedState))
	)
	return (
		<EditorExtendedContext.Provider value={{ useEpisodeExtendedStoreUtil }}>
			{children}
		</EditorExtendedContext.Provider>
	)
}

export default function useEditorExtendedState() {
	const value = useContext(EditorExtendedContext)
	if (!value) {
		throw new Error(
			'useEditorExtendedState must be used within a EditorExtendedStateProvider'
		)
	}
	return value
}

'use client'

import React, { createContext, useContext, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import { create, StoreApi, UseBoundStore } from 'zustand'
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

import { EditorExtendedStore } from '@/types/editor-types'

const initialExtendedState: EditorExtendedStore = {
	episodeMap: {},
	extended: [],
	episodeKeys: {},
	episodeContentMap: {},
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
	const searchParams = useSearchParams()
	const paramExtend = useMemo(() => searchParams.get('extend'), [searchParams])
	const extended = useMemo(
		() =>
			paramExtend!
				.split(',')
				.map((id) => Number(id))
				.filter((id) => !isNaN(id)) || [episodeId],
		[paramExtend, episodeId]
	)

	const extendedState: EditorExtendedStore = {
		...initialExtendedState,
		extended: extended,
	}
	const useEpisodeExtendedStoreUtil = create(
		devtools(immer(() => extendedState))
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

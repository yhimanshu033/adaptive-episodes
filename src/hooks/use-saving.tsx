import React, { useCallback, useEffect, useMemo, useRef } from 'react'
import useEpisodeHook from '@/hooks/mutation/use-episode-hook'
import useComments from '@/hooks/plate/use-comments'
import useEpisodeContent from '@/hooks/query/use-episode-content'
import useEpisodeIdStore from '@/store/episode-id-store'
import { useEditorState } from '@udecode/plate-common/react'
import { useShallow } from 'zustand/react/shallow'

import { clearLasers } from '@/lib/utils/plate'

import { BASE_STATUS } from '@/types/common'
import { TSaveEpisodeParams, TSavingContext } from '@/types/episode-type'

const SavingContext = React.createContext<TSavingContext | undefined>(undefined)

export function SavingContextProvider({
	children: nodeChildren,
}: {
	children: React.ReactNode
}) {
	const { children } = useEditorState()
	const { allComments } = useComments()
	const { saveEpisodeMutation } = useEpisodeHook()
	const { data } = useEpisodeContent()
	const {
		store: useEpisodeIdStoreContext,
		setCurrentTitle,
		setNotes,
	} = useEpisodeIdStore()
	const currentTitle = useEpisodeIdStoreContext(
		useShallow((state) => state.currentTitle)
	)
	const notes = useEpisodeIdStoreContext(useShallow((state) => state.notes))
	const savedRef = useRef(JSON.stringify(children))
	const savedCommentsRef = useRef(JSON.stringify(allComments))
	const savedTitleRef = useRef(data?.chapter.chapter_title || '')
	const savedNotesRef = useRef(JSON.stringify(data?.chapter.props?.notes || []))

	const isSaved = useMemo(() => {
		const currentChildren = JSON.stringify(children)
		const currentComments = JSON.stringify(allComments)
		const currentNotes = JSON.stringify(notes)
		return (
			savedRef.current === currentChildren &&
			savedCommentsRef.current === currentComments &&
			currentTitle === savedTitleRef.current &&
			currentNotes === savedNotesRef.current
		)
	}, [children, allComments, currentTitle, notes])

	const handleSave = useCallback(
		async ({ forced = false }: TSaveEpisodeParams = {}) => {
			if (forced || !isSaved) {
				if (!data?.chapter) return
				savedRef.current = JSON.stringify(children)
				savedCommentsRef.current = JSON.stringify(allComments)
				savedTitleRef.current = currentTitle
				savedNotesRef.current = JSON.stringify(notes)
				const clearedLaser = clearLasers(children)
				const text = JSON.stringify(clearedLaser)
				const status = data?.chapter.status || BASE_STATUS
				const chapterId = data?.chapter.parent
				await saveEpisodeMutation.mutateAsync({
					status,
					chapterId,
					text,
					comments: allComments,
					prevProps: data?.chapter.props,
					notes,
					chapter_title: currentTitle || data?.chapter.chapter_title,
				})
			}
		},
		[
			children,
			allComments,
			data?.chapter,
			saveEpisodeMutation,
			currentTitle,
			isSaved,
			notes,
		]
	)

	useEffect(() => {
		if (
			savedCommentsRef.current !== JSON.stringify(allComments) ||
			savedNotesRef.current !== JSON.stringify(notes)
		) {
			void handleSave()
		}
	}, [allComments, handleSave, notes, currentTitle])

	useEffect(() => {
		const handleBeforeUnload = () => {
			if (!isSaved) {
				void handleSave()
			}
		}

		window.addEventListener('beforeunload', handleBeforeUnload)

		return () => {
			window.removeEventListener('beforeunload', handleBeforeUnload)
		}
	}, [isSaved, handleSave])

	useEffect(() => {
		if (!data?.chapter) return
		if (data.chapter.chapter_title) {
			setCurrentTitle(data.chapter.chapter_title)
			savedTitleRef.current = data.chapter.chapter_title
		}
		if (data.chapter.props?.notes) {
			setNotes(data.chapter.props.notes)
			savedNotesRef.current = JSON.stringify(data.chapter.props.notes)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [data?.chapter])

	const value = {
		handleSave,
		isSaved,
		isPending: saveEpisodeMutation.isPending,
	}

	return (
		<SavingContext.Provider value={value}>
			{nodeChildren}
		</SavingContext.Provider>
	)
}

export default function useSaving() {
	const context = React.useContext(SavingContext)
	if (!context) {
		throw new Error('useSaving must be used within a SavingContextProvider')
	}
	return context
}

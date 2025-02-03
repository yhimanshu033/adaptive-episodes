import React, { useCallback, useEffect, useMemo, useRef } from 'react'
import { useParams, usePathname } from 'next/navigation'
import useEpisodeHook from '@/hooks/mutation/use-episode-hook'
import useComments from '@/hooks/plate/use-comments'
import useEpisodeIdStore from '@/store/episode-id-store'
import {
	addUnsavedEpisodeParams,
	removeUnsavedEpisodeParams,
} from '@/store/global-store'
import { useEditorState } from '@udecode/plate-common/react'
import { useShallow } from 'zustand/react/shallow'

import { clearLasers } from '@/lib/utils/plate'

import { BASE_STATUS } from '@/types/common'
import {
	TGetEpisodeResponse,
	TSaveEpisodeParams,
	TSavingContext,
} from '@/types/episode-type'

const SavingContext = React.createContext<TSavingContext | undefined>(undefined)

export function SavingContextProvider({
	children: nodeChildren,
	data,
}: {
	children: React.ReactNode
	data: TGetEpisodeResponse
}) {
	const { id } = useParams()
	const { children } = useEditorState()
	const { allComments } = useComments()
	const { saveEpisodeMutation } = useEpisodeHook()
	const {
		store: useEpisodeIdStoreContext,
		setCurrentTitle,
		setNotes,
		setStartOverlayLoading,
	} = useEpisodeIdStore()
	const currentTitle = useEpisodeIdStoreContext(
		useShallow((state) => state.currentTitle)
	)

	const notes = useEpisodeIdStoreContext(useShallow((state) => state.notes))
	const savedRef = useRef(JSON.stringify(children))
	const savedCommentsRef = useRef(JSON.stringify(allComments))
	const savedTitleRef = useRef(data?.chapter.chapter_title || '')
	const savedNotesRef = useRef(JSON.stringify(data?.chapter.props?.notes || []))
	const [forceSave, setForceSave] = React.useState(false)

	const pathname = usePathname()
	const isSaved = useMemo(() => {
		if (forceSave) return false
		const currentChildren = JSON.stringify(children)
		const currentComments = JSON.stringify(allComments)
		const currentNotes = JSON.stringify(notes)
		const storedNotes =
			savedNotesRef.current === JSON.stringify([])
				? savedNotesRef.current
				: JSON.stringify(data?.chapter.props?.notes || [])
		return (
			savedRef.current === currentChildren &&
			savedCommentsRef.current === currentComments &&
			(savedTitleRef.current
				? currentTitle === savedTitleRef.current
				: currentTitle === data?.chapter?.chapter_title) &&
			currentNotes === storedNotes
		)
	}, [children, allComments, currentTitle, notes, data?.chapter, forceSave])

	const handleSave = useCallback(
		async ({
			forced = false,
			startOverlayLoading = false,
			stopOverlayLoading = false,
		}: TSaveEpisodeParams = {}) => {
			if (!data?.chapter || (!forced && isSaved)) return
			if (startOverlayLoading) {
				setStartOverlayLoading(true)
			}
			try {
				savedRef.current = JSON.stringify(children)
				savedCommentsRef.current = JSON.stringify(allComments)
				savedTitleRef.current = currentTitle
				savedNotesRef.current = JSON.stringify(notes)
				setForceSave(false)
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
			} catch (error) {
				console.error(error)
			} finally {
				if (stopOverlayLoading) {
					setStartOverlayLoading(false)
				}
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
			setStartOverlayLoading,
			setForceSave,
		]
	)

	const handleSaveGlobalStore = useCallback(() => {
		if (!data?.chapter) return
		savedRef.current = JSON.stringify(children)
		savedCommentsRef.current = JSON.stringify(allComments)
		savedTitleRef.current = currentTitle
		savedNotesRef.current = JSON.stringify(notes)
		const clearedLaser = clearLasers(children)
		const text = JSON.stringify(clearedLaser)
		const status = data?.chapter.status || BASE_STATUS
		const chapterId = data?.chapter.parent

		addUnsavedEpisodeParams(`${chapterId}_${pathname}`, {
			projectId: Number(id),
			status,
			episodeId: Number(chapterId),
			text,
			props: {
				...data?.chapter.props,
				comments: allComments,
				notes,
			},
			chapter_title: currentTitle || data?.chapter.chapter_title,
		})
	}, [id, children, allComments, data?.chapter, currentTitle, notes, pathname])

	const handleRemoveGlobalStore = useCallback(() => {
		if (!data?.chapter) return
		const chapterId = data?.chapter.parent
		removeUnsavedEpisodeParams(`${chapterId}_${pathname}`)
	}, [data?.chapter, pathname])

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
			savedTitleRef.current = data.chapter.chapter_title
			setCurrentTitle(data.chapter.chapter_title)
		}
		if (data.chapter.props?.notes) {
			savedNotesRef.current = JSON.stringify(data.chapter.props.notes)
			setNotes(data.chapter.props.notes)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [data])

	useEffect(() => {
		if (isSaved) {
			handleRemoveGlobalStore()
		} else {
			handleSaveGlobalStore()
		}
		return () => {
			handleRemoveGlobalStore()
		}
	}, [
		isSaved,
		children,
		allComments,
		notes,
		currentTitle,
		handleRemoveGlobalStore,
		handleSaveGlobalStore,
	])

	const value = {
		handleSave,
		isSaved,
		isPending: saveEpisodeMutation.isPending,
		setForceSave,
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

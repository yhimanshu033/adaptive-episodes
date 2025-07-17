import React, { useCallback, useEffect, useRef } from 'react'
import { useParams, usePathname } from 'next/navigation'
import useEpisodeHook from '@/hooks/mutation/use-episode-hook'
import useEpisodeIdStore from '@/store/episode-id-store'
import {
	addUnsavedEpisodeParams,
	removeUnsavedEpisodeParams,
} from '@/store/global-store'
import { useEditorState, useEditorString, usePluginOption } from 'platejs/react'
import { useShallow } from 'zustand/react/shallow'

import { discussionPlugin } from '@/components/editor/plugins/discussion-kit'
import { setValue } from '@/lib/utils/indexed-db'
import { clearLasers } from '@/lib/utils/plate'

import { BASE_STATUS, ELanguage, EStatus } from '@/types/common'
import { SaveEpisodeParams, TGetEpisodeResponse } from '@/types/episode-type'

const SavingContext = React.createContext<
	| {
			handleSave: () => Promise<void>
			isPending: boolean
			isSaved: boolean
			lastSaved?: Date
			setForceSave: React.Dispatch<React.SetStateAction<boolean>>
	  }
	| undefined
>(undefined)

export function SavingContextProvider({
	children: nodeChildren,
	data,
	initialForceSave = false,
}: {
	children: React.ReactNode
	data: TGetEpisodeResponse
	initialForceSave?: boolean
}) {
	const { id } = useParams()
	const { children } = useEditorState()
	const editorText = useEditorString()
	const allComments = usePluginOption(discussionPlugin, 'discussions')

	const { saveEpisodeMutation, statusUpdateMutation } = useEpisodeHook()

	const { store: useEpisodeIdStoreContext, setCurrentTitle } =
		useEpisodeIdStore()

	const currentTitle = useEpisodeIdStoreContext(
		useShallow((state) => state.currentTitle)
	)

	const savedRef = useRef(JSON.stringify(children))
	const savedCommentsRef = useRef(JSON.stringify(allComments))
	const savedTitleRef = useRef(data?.chapter.chapter_title || '')
	const [forceSave, setForceSave] = React.useState(initialForceSave)
	const [lastSaved, setLastSaved] = React.useState<Date>()
	const [isSaved, setIsSaved] = React.useState(true)

	console.log({ isSaved })

	const pathname = usePathname()

	useEffect(() => {
		const currentChildren = JSON.stringify(children)
		const currentComments = JSON.stringify(allComments)
		const storedTitle = savedTitleRef.current || data?.chapter?.chapter_title

		const newIsSaved =
			!forceSave &&
			savedRef.current === currentChildren &&
			savedCommentsRef.current === currentComments &&
			currentTitle === storedTitle

		setIsSaved(newIsSaved)
	}, [children, allComments, currentTitle, data?.chapter, forceSave])

	const handleSave = useCallback(async () => {
		if (!data?.chapter || (!forceSave && isSaved)) {
			return
		}

		try {
			const words = editorText.split(/\s+/)
			const word_count = words.length
			savedRef.current = JSON.stringify(children)
			savedCommentsRef.current = JSON.stringify(allComments)
			savedTitleRef.current = currentTitle
			const clearedLaser = clearLasers(children)
			const text = JSON.stringify(clearedLaser)
			let status = data?.chapter.status || BASE_STATUS
			const language = data?.chapter.language || ELanguage.GERMAN_ORIGINAL
			const chapterId = data?.chapter.id

			const dataToSave: SaveEpisodeParams = {
				projectId: Number(id),
				status,
				episodeId: Number(data?.chapter.parent || chapterId),
				id: Number(chapterId),
				text,
				word_count,
				language,
				props: {
					...data?.chapter.props,
					comments: allComments,
				},
				chapter_title: currentTitle || data?.chapter.chapter_title,
			}

			void setValue(`${String(id)}_${String(chapterId)}`, dataToSave)

			if (language === ELanguage.GERMAN_ORIGINAL && status === BASE_STATUS) {
				await statusUpdateMutation.mutateAsync({
					parent_id: chapterId,
					status,
					language: data?.chapter.language || ELanguage.GERMAN_ORIGINAL,
				})
				status = EStatus.FIRST_DRAFT
			}

			await saveEpisodeMutation.mutateAsync({
				status,
				chapterId,
				text,
				word_count,
				comments: allComments,
				prevProps: data?.chapter.props,
				language,
				chapter_title: currentTitle || data?.chapter.chapter_title,
			})

			setLastSaved(new Date())
			setForceSave(false)
			setIsSaved(true)
		} catch (error) {
			console.error(error)
		}
	}, [
		data?.chapter,
		forceSave,
		isSaved,
		editorText,
		children,
		allComments,
		currentTitle,
		id,
		saveEpisodeMutation,
		statusUpdateMutation,
	])

	const handleSaveGlobalStore = useCallback(() => {
		if (!data?.chapter) {
			return
		}
		const clearedLaser = clearLasers(children)
		const text = JSON.stringify(clearedLaser)
		const status = data?.chapter.status || BASE_STATUS
		const chapterId = data?.chapter.id

		const dataToSave: SaveEpisodeParams = {
			projectId: Number(id),
			status:
				!data?.chapter.language ||
				data?.chapter.language === ELanguage.GERMAN_ORIGINAL
					? status === BASE_STATUS
						? EStatus.FIRST_DRAFT
						: status
					: BASE_STATUS,
			episodeId: Number(data?.chapter.parent || chapterId),
			text,
			id: Number(chapterId),
			language: data?.chapter.language || ELanguage.GERMAN_ORIGINAL,
			props: {
				...data?.chapter.props,
				comments: allComments,
			},
			chapter_title: currentTitle || data?.chapter.chapter_title,
		}

		addUnsavedEpisodeParams(
			`${String(id)}_${String(chapterId)}_${pathname}`,
			dataToSave
		)
	}, [id, children, allComments, data?.chapter, currentTitle, pathname])

	const handleRemoveGlobalStore = useCallback(() => {
		if (!data?.chapter) {
			return
		}
		const chapterId = data?.chapter.parent
		removeUnsavedEpisodeParams(`${String(id)}_${String(chapterId)}_${pathname}`)
	}, [data?.chapter, pathname, id])

	useEffect(() => {
		if (savedCommentsRef.current !== JSON.stringify(allComments)) {
			void handleSave()
		}
	}, [allComments, handleSave, currentTitle])

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
		if (!data?.chapter) {
			return
		}
		if (data.chapter.chapter_title) {
			savedTitleRef.current = data.chapter.chapter_title
			setCurrentTitle(data.chapter.chapter_title)
		}
	}, [data, setCurrentTitle])

	useEffect(() => {
		if (isSaved) {
			handleRemoveGlobalStore()
		} else {
			handleSaveGlobalStore()
		}
	}, [
		isSaved,
		children,
		allComments,
		currentTitle,
		handleRemoveGlobalStore,
		handleSaveGlobalStore,
	])

	const value = {
		handleSave,
		isSaved,
		isPending: saveEpisodeMutation.isPending,
		setForceSave,
		lastSaved,
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

import React, { useCallback, useEffect, useMemo, useRef } from 'react'
import { useParams, usePathname } from 'next/navigation'
import useEpisodeHook from '@/hooks/mutation/use-episode-hook'
import useComments from '@/hooks/plate/use-comments'
import useEpisodeIdStore from '@/store/episode-id-store'
import {
	addUnsavedEpisodeParams,
	removeUnsavedEpisodeParams,
} from '@/store/global-store'
import {
	elementStore,
	useEditorPlugin,
	useEditorRef,
	useEditorString,
} from 'platejs/react'
import { useShallow } from 'zustand/react/shallow'

import { commentPlugin } from '@/components/editor/plugins/comment-kit'
import { useCreateDiscussionKit } from '@/components/editor/plugins/discussion-kit'
import useResolvedComments from '@/lib/plate/plugins/resolved-comments/use-resolved-comments'
import { setValue } from '@/lib/utils/indexed-db'
import {
	clearLasers,
	getUniqueAllComments,
	getWordCount,
} from '@/lib/utils/plate'

import { BASE_STATUS, ELanguage, EStatus } from '@/types/common'
import { TCustomComment } from '@/types/editor-types'
import {
	SaveEpisodeParams,
	TGetEpisodeResponse,
	TSaveEpisodeParams,
	TSavingContext,
} from '@/types/episode-type'

const SavingContext = React.createContext<TSavingContext | undefined>(undefined)

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
	const { children } = useEditorRef()
	const editorText = useEditorString()
	const discussionPlugin = useCreateDiscussionKit()
	const { api, setOption, getOption } = useEditorPlugin(discussionPlugin)

	// const { allComments, set } = useComments()
	const allComments = getOption('discussions')
	// const set = () => {}
	// console.log({ comments: getOption('discussions'), editorText })

	const { saveEpisodeMutation, statusUpdateMutation } = useEpisodeHook()

	const {
		store: useEpisodeIdStoreContext,
		setCurrentTitle,
		setResolvedComments,
		setStartOverlayLoading,
	} = useEpisodeIdStore()

	const currentTitle = useEpisodeIdStoreContext(
		useShallow((state) => state.currentTitle)
	)

	// const { resolvedComments } = useResolvedComments()
	const resolvedComments = [] as TCustomComment[]
	const savedRef = useRef(JSON.stringify(children))
	const savedCommentsRef = useRef(JSON.stringify(allComments))
	const savedTitleRef = useRef(data?.chapter.chapter_title || '')
	const savedResolvedCommentsRef = useRef(
		JSON.stringify(data?.chapter.props?.resolvedComments || [])
	)
	const [forceSave, setForceSave] = React.useState(initialForceSave)
	const [lastSaved, setLastSaved] = React.useState<Date>()

	// const { allComments, cleanedCommentsRecord } = useMemo(
	// 	() => getUniqueAllComments(children, allComments),
	// 	[allComments, children]
	// )

	const pathname = usePathname()
	const isSaved = useMemo(() => {
		if (forceSave) {
			return false
		}
		const currentChildren = JSON.stringify(children)
		const currentComments = JSON.stringify(allComments)
		const currentResolvedComments = JSON.stringify(resolvedComments)
		const storedResolvedComments =
			savedResolvedCommentsRef.current === JSON.stringify([])
				? savedResolvedCommentsRef.current
				: JSON.stringify(data?.chapter.props?.resolvedComments || [])
		const storedTitle = savedTitleRef.current
			? savedTitleRef.current
			: data?.chapter?.chapter_title
		return (
			savedRef.current === currentChildren &&
			savedCommentsRef.current === currentComments &&
			currentTitle === storedTitle &&
			storedResolvedComments === currentResolvedComments
		)
	}, [
		children,
		allComments,
		currentTitle,
		data?.chapter,
		forceSave,
		resolvedComments,
	])

	const handleSave = useCallback(
		async ({
			forced = false,
			startOverlayLoading = false,
			stopOverlayLoading = false,
		}: TSaveEpisodeParams = {}) => {
			if (!data?.chapter || (!forced && isSaved)) {
				return
			}

			if (startOverlayLoading) {
				setStartOverlayLoading(true)
			}

			try {
				// if (allComments.length !== allComments.length) {
				// 	set({
				// 		comments: cleanedCommentsRecord,
				// 	})
				// }

				const words = editorText.split(/\s+/)
				const word_count = words.length
				savedRef.current = JSON.stringify(children)
				savedCommentsRef.current = JSON.stringify(allComments)
				savedTitleRef.current = currentTitle
				setForceSave(false)
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
						resolvedComments,
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

				setLastSaved(new Date())

				await saveEpisodeMutation.mutateAsync({
					status,
					chapterId,
					text,
					word_count,
					comments: allComments,
					prevProps: data?.chapter.props,
					language,
					resolvedComments,
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
			data?.chapter,
			isSaved,
			setStartOverlayLoading,
			editorText,
			children,
			allComments,
			currentTitle,
			id,
			resolvedComments,
			saveEpisodeMutation,
			statusUpdateMutation,
		]
	)

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
				resolvedComments,
			},
			chapter_title: currentTitle || data?.chapter.chapter_title,
		}

		addUnsavedEpisodeParams(
			`${String(id)}_${String(chapterId)}_${pathname}`,
			dataToSave
		)
	}, [
		id,
		children,
		allComments,
		data?.chapter,
		currentTitle,
		pathname,
		resolvedComments,
	])

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
		if (data.chapter.props?.resolvedComments) {
			setResolvedComments(
				(data.chapter.props.resolvedComments || []) as TCustomComment[]
			)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [data])

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

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useParams } from 'next/navigation'
import useEpisodeHook from '@/hooks/mutation/use-episode-hook'
import useEpisodeContent from '@/hooks/query/use-episode-content'
import { toast } from 'sonner'
import {
	useEditorData,
	useEpisodeIdStore,
	usePluginOption,
	useUnifiedEditorState,
} from 'unified-editor'
import { useShallow } from 'zustand/react/shallow'

import { getSavingData } from '@/lib/utils/helpers'
import { setValue } from '@/lib/utils/indexed-db'
import { clearLasers } from '@/lib/utils/plate'

import { BASE_STATUS, ELanguage } from '@/types/common'
import { TGetSavingParamsRet } from '@/types/content-types'
import {
	SaveEpisodeParams,
	TGetEpisodeResponse,
	TSaveEpisodeFailMessage,
	TSaveEpisodeParams,
} from '@/types/episode-type'

interface IUseSavingUtilProps {
	data?: TGetEpisodeResponse
	initialForceSave?: boolean
}
function useSavingUtil(props?: IUseSavingUtilProps) {
	const { data } = useEpisodeContent()
	const initialForceSave = props?.initialForceSave
	const { id } = useParams()
	const { wordCount } = useEditorData()
	const { children } = useUnifiedEditorState()
	const allComments = usePluginOption(
		{ key: 'discussion' },
		'discussions'
	) as Array<unknown>
	const { saveEpisodeMutation } = useEpisodeHook()

	const {
		store: useEpisodeIdStoreContext,
		setCurrentTitle,
		setRecentEmail,
		setStartOverlayLoading,
	} = useEpisodeIdStore()

	const currentTitle = useEpisodeIdStoreContext(
		useShallow((state) => state.currentTitle)
	)

	const [savedData, setSavedData] = useState({
		content: JSON.stringify(children),
		comments: JSON.stringify(allComments),
		title: data?.chapter.chapter_title || '',
	})
	const [forceSave, setForceSave] = React.useState(initialForceSave)
	const [lastSaved, setLastSaved] = React.useState<Date>()

	const isSaved = useMemo(() => {
		const currentChildren = JSON.stringify(children)
		const currentComments = JSON.stringify(allComments)
		const storedTitle = savedData.title || data?.chapter?.chapter_title

		const newIsSaved =
			!forceSave &&
			savedData.content === currentChildren &&
			savedData.comments === currentComments &&
			currentTitle === storedTitle

		return newIsSaved
	}, [children, allComments, currentTitle, data?.chapter, forceSave, savedData])

	const getSavingParams = useCallback((): TGetSavingParamsRet => {
		const word_count = wordCount
		const contentStr = JSON.stringify(children)
		const commentsStr = JSON.stringify(allComments)
		const title = currentTitle
		const clearedLaser = clearLasers(children)
		const text = JSON.stringify(clearedLaser)
		const status = data?.chapter.status || BASE_STATUS
		const language = data?.chapter.language || ELanguage.GERMAN_ORIGINAL
		const chapterId = data?.chapter.id || 0

		return {
			word_count,
			contentStr,
			text,
			status,
			language,
			chapterId,
			title,
			commentsStr,
			chapterData: data || undefined,
			allComments,
		}
	}, [wordCount, children, allComments, data, currentTitle])

	const saveLocal = useCallback(
		(args: TGetSavingParamsRet) => {
			const dataToSave: SaveEpisodeParams = {
				projectId: Number(id),
				status: args.status,
				episodeId: Number(args.chapterData?.chapter.parent || args.chapterId),
				id: Number(args.chapterId),
				text: args.text,
				word_count: args.word_count,
				language: args.language,
				props: {
					...args.chapterData?.chapter.props,
					comments: args.allComments,
				},
				chapter_title: args.title || args.chapterData?.chapter.chapter_title,
			}

			void setValue(`${String(id)}_${String(args.chapterId)}`, dataToSave)
		},
		[id]
	)

	const handleSave = useCallback(
		async ({
			forced = false,
			startOverlayLoading = false,
			stopOverlayLoading = false,
		}: TSaveEpisodeParams = {}) => {
			// if current chapter data is unavailable or content is already saved with forceSaving disabled --> do not proceed
			if (!data?.chapter || (!forced && isSaved)) {
				return
			}

			// show an overlay of loading when the arg is true
			if (startOverlayLoading) {
				setStartOverlayLoading(true)
			}

			try {
				const params = getSavingParams() // retrieve saving params

				saveLocal(params) // save a local backup in case saving fails

				const respData = await saveEpisodeMutation.mutateAsync(
					getSavingData(params)
				) // update request

				// check if saving failed
				if (!respData.success) {
					const message = respData.message as TSaveEpisodeFailMessage

					if (message.email) {
						// check if someone else is editing chapter
						toast.error(
							`Saving failed, ${message.email} is currently working on the episode ${params.chapterData?.chapter.seq_number}!`
						)
						setRecentEmail(message.email)
					} else {
						toast.error('Saving failed!')
					}
				} else {
					setLastSaved(new Date()) // change last saved date if saving succeeds
				}
				// change states accordingly
				setForceSave(false)
				// Update last saved contents
				setSavedData({
					content: params.contentStr,
					comments: params.commentsStr,
					title: params.title,
				})
			} catch (error) {
				console.error(error)
			} finally {
				// stop overlay loading in any case
				if (stopOverlayLoading) {
					setStartOverlayLoading(false)
				}
			}
		},
		[
			data?.chapter,
			isSaved,
			setStartOverlayLoading,
			getSavingParams,
			saveEpisodeMutation,
			saveLocal,
			setRecentEmail,
			setSavedData,
		]
	)

	useEffect(() => {
		if (!data?.chapter) {
			return
		}
		if (data.chapter.chapter_title) {
			setSavedData((prev) => ({ ...prev, title: data.chapter.chapter_title }))
			setCurrentTitle(data.chapter.chapter_title)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [data])

	return {
		handleSave,
		isSaved,
		isPending: saveEpisodeMutation.isPending,
		setForceSave,
		lastSaved,
		getSavingParams,
		data,
		setSavedData,
	}
}

const SavingContext = React.createContext<
	ReturnType<typeof useSavingUtil> | undefined
>(undefined)

export function SavingContextProvider({
	children: nodeChildren,
}: IUseSavingUtilProps & React.PropsWithChildren) {
	const value = useSavingUtil()
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

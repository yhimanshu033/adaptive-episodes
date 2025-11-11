import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useParams } from 'next/navigation'
import useEpisodeHook from '@/hooks/mutation/use-episode-hook'
import useEditorData from '@/hooks/plate/use-editor-data'
import useEpisodeIdStore from '@/store/episode-id-store'
import { useEditorState, usePluginOption } from 'platejs/react'
import { toast } from 'sonner'
import { useShallow } from 'zustand/react/shallow'

import { discussionPlugin } from '@/components/editor/plugins/discussion-kit'
import { getSavingData } from '@/lib/utils/helpers'
import { setValue } from '@/lib/utils/indexed-db'
import { clearLasers } from '@/lib/utils/plate'
import { createRateLimiter } from '@/lib/utils/rate-limit'

import { BASE_STATUS, ELanguage } from '@/types/common'
import { TGetSavingParamsRet } from '@/types/content-types'
import {
	SaveEpisodeParams,
	TEpisodeProps,
	TGetEpisodeResponse,
	TLLMMemories,
	TSaveEpisodeFailMessage,
	TSaveEpisodeParams,
} from '@/types/episode-type'

interface IUseSavingUtilProps {
	data: TGetEpisodeResponse
	initialForceSave?: boolean
}
function useSavingUtil({ data, initialForceSave }: IUseSavingUtilProps) {
	const { id } = useParams()
	const { wordCount } = useEditorData()
	const { children } = useEditorState()
	const allComments = usePluginOption(discussionPlugin, 'discussions')
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
	const currentLLMMemories = useEpisodeIdStoreContext(
		useShallow((state) => state.currentLLMMemories)
	)

	const rateLimit = useMemo(() => createRateLimiter(70, 60 * 1000), [])

	const [savedData, setSavedData] = useState({
		content: JSON.stringify(children),
		comments: JSON.stringify(allComments),
		title: data?.chapter.chapter_title || '',
		llmMemories: data?.chapter?.props?.llm_memories as TLLMMemories,
	})

	const [forceSave, setForceSave] = React.useState(initialForceSave)
	const [lastSaved, setLastSaved] = React.useState<Date>()

	const isSaved = useMemo(() => {
		const currentChildren = JSON.stringify(children)
		const currentComments = JSON.stringify(allComments)
		const storedTitle = savedData.title || data?.chapter?.chapter_title
		const storedLLMMemories =
			savedData.llmMemories || data?.chapter?.props?.llm_memories
		const storedLLMMemoriesStr = JSON.stringify(
			savedData.llmMemories || data?.chapter?.props?.llm_memories
		)
		const currentLLMMemoriesStr = JSON.stringify({
			...storedLLMMemories,
			...currentLLMMemories,
		})

		const newIsSaved =
			!forceSave &&
			savedData.content === currentChildren &&
			savedData.comments === currentComments &&
			currentTitle === storedTitle &&
			currentLLMMemoriesStr === storedLLMMemoriesStr

		return newIsSaved
	}, [
		children,
		allComments,
		currentTitle,
		data?.chapter,
		forceSave,
		savedData,
		currentLLMMemories,
	])

	const getSavingParams = useCallback((): TGetSavingParamsRet => {
		const word_count = wordCount.value
		const contentStr = JSON.stringify(children)
		const commentsStr = JSON.stringify(allComments)
		const title = currentTitle
		const clearedLaser = clearLasers(children)
		const text = JSON.stringify(clearedLaser)
		const status = data?.chapter.status || BASE_STATUS
		const language = data?.chapter.language || ELanguage.GERMAN_ORIGINAL
		const chapterId = data?.chapter.id
		const llmMemories = {
			...savedData.llmMemories,
			...currentLLMMemories,
		}

		return {
			word_count,
			contentStr,
			text,
			status,
			language,
			chapterId,
			title,
			commentsStr,
			chapterData: data,
			allComments,
			llmMemories,
			llmMemoriesStr: JSON.stringify(llmMemories),
		}
	}, [
		wordCount.value,
		children,
		allComments,
		data,
		currentTitle,
		currentLLMMemories,
		savedData,
	])

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
					llm_memories: {
						...args.chapterData?.chapter.props?.llm_memories,
						...((args.llmMemories as TLLMMemories) ?? {}),
					} as TEpisodeProps,
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
			if (
				!data?.chapter ||
				(!forced && isSaved) ||
				saveEpisodeMutation.isPending
			) {
				return
			}

			// show an overlay of loading when the arg is true
			if (startOverlayLoading) {
				setStartOverlayLoading(true)
			}

			try {
				const params = getSavingParams() // retrieve saving params

				saveLocal(params) // save a local backup in case saving fails

				const respData = await rateLimit(
					saveEpisodeMutation.mutateAsync,
					getSavingData(getSavingParams())
				) // add rate limit for saving requests in the frontend

				// check if saving failed
				if (!respData.success) {
					const message = respData.message as TSaveEpisodeFailMessage

					if (message.email) {
						// check if someone else is editing chapter
						toast.error(
							`Saving failed, ${message.email} is currently working on the episode ${params.chapterData.chapter.seq_number}!`
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
					llmMemories: params?.llmMemories || {},
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
			rateLimit,
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
	data,
	initialForceSave = false,
}: IUseSavingUtilProps & React.PropsWithChildren) {
	const value = useSavingUtil({ data, initialForceSave })
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

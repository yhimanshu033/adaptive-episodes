import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useParams } from 'next/navigation'
import useChapterPropsMutation from '@/hooks/mutation/use-prop-saving'
import useTextSaving from '@/hooks/mutation/use-text-saving'
import useEditorData from '@/hooks/plate/use-editor-data'
import useEditAccess from '@/hooks/use-edit-access'
import useEpisodeIdStore from '@/store/episode-id-store'
import { useEditorState, usePluginOption } from 'platejs/react'
import { useShallow } from 'zustand/react/shallow'

import { discussionPlugin } from '@/components/editor/plugins/discussion-kit'
import { setValue } from '@/lib/utils/indexed-db'
import { clearLasers } from '@/lib/utils/plate'

import { BASE_STATUS, ELanguage } from '@/types/common'
import { TGetSavingParamsRet } from '@/types/content-types'
import {
	DeepPartial,
	SaveEpisodeParams,
	TEpisode,
	TEpisodeProps,
	TGetEpisodeResponse,
	TLLMMemories,
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
	const { mutateAsync: saveText, isPending: isTextSaving } = useTextSaving()
	const { mutateAsync: saveProps, isPending: isPropsSaving } =
		useChapterPropsMutation()

	const { cannotEdit } = useEditAccess()

	const saveWorking = useMemo(() => {
		return isTextSaving || isPropsSaving
	}, [isTextSaving, isPropsSaving])

	const {
		store: useEpisodeIdStoreContext,
		setCurrentTitle,
		setStartOverlayLoading,
	} = useEpisodeIdStore()

	const currentLLMMemories = useEpisodeIdStoreContext(
		useShallow((state) => state.currentLLMMemories)
	)

	const [savedData, setSavedData] = useState({
		content: JSON.stringify(children),
		comments: JSON.stringify(allComments),
		llmMemories: data?.chapter?.props?.llm_memories as TLLMMemories,
		wordCount: data?.chapter?.word_count,
	})

	const [forceSave, setForceSave] = React.useState(initialForceSave)
	const [lastSaved, setLastSaved] = React.useState<Date>()

	const isTextSaved = useCallback(
		(text: string) => {
			return text === savedData.content
		},
		[savedData]
	)

	const isCommentsSaved = useCallback(
		(allComments: TGetSavingParamsRet['allComments']) => {
			const comments = JSON.stringify(allComments || [])

			return comments === savedData.comments
		},
		[savedData]
	)

	const isLLMMemoriesSaved = useCallback(
		(llmMemories: TGetSavingParamsRet['llmMemories']) => {
			const storedLLMMemories =
				savedData.llmMemories || data?.chapter?.props?.llm_memories
			const storedLLMMemoriesStr = JSON.stringify(
				savedData.llmMemories || data?.chapter?.props?.llm_memories || {}
			)
			const currentLLMMemoriesStr = JSON.stringify({
				...storedLLMMemories,
				...llmMemories,
			})
			return currentLLMMemoriesStr === storedLLMMemoriesStr
		},
		[savedData, data]
	)

	const isWordCountSaved = useCallback(
		(word_count: TGetSavingParamsRet['word_count']) => {
			return word_count === savedData.wordCount
		},
		[savedData.wordCount]
	)

	const isSaved = useMemo(() => {
		if (cannotEdit) {
			return true
		}
		const currentChildren = JSON.stringify(children)
		const newIsSaved =
			!forceSave &&
			isTextSaved(currentChildren) &&
			isCommentsSaved(allComments) &&
			isLLMMemoriesSaved(currentLLMMemories) &&
			isWordCountSaved(wordCount.value)

		return newIsSaved
	}, [
		children,
		allComments,
		forceSave,
		currentLLMMemories,
		wordCount.value,
		isTextSaved,
		isCommentsSaved,
		isLLMMemoriesSaved,
		isWordCountSaved,
		cannotEdit,
	])

	const getUnsavedChapterSavingParams = useCallback(
		(params: TGetSavingParamsRet): DeepPartial<TEpisode> => {
			let body: DeepPartial<TEpisode> = {}
			if (!isWordCountSaved(params.word_count)) {
				body = {
					word_count: params.word_count,
				}
			}

			if (!isCommentsSaved(params.allComments)) {
				body = {
					...body,
					props: {
						comments: params.allComments,
					},
				}
			}

			if (!isLLMMemoriesSaved(params.llmMemories) && params.llmMemories) {
				body = {
					...body,
					props: {
						...body.props,
						llm_memories: params.llmMemories as TEpisodeProps,
					},
				}
			}

			return body
		},
		[isLLMMemoriesSaved, isWordCountSaved, isCommentsSaved]
	)

	const getSavingParams = useCallback((): TGetSavingParamsRet => {
		const word_count = wordCount.value
		const contentStr = JSON.stringify(children)
		const commentsStr = JSON.stringify(allComments)
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
		savedData,
		currentLLMMemories,
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
			if (!data?.chapter || (!forced && isSaved) || saveWorking) {
				return
			}

			// show an overlay of loading when the arg is true
			if (startOverlayLoading) {
				setStartOverlayLoading(true)
			}

			try {
				const params = getSavingParams() // retrieve saving params

				saveLocal(params) // save a local backup in case saving fails

				const unsavedParams = getUnsavedChapterSavingParams(params)

				const textPromise = !isTextSaved(params.contentStr)
					? saveText({ content: params.contentStr })
					: Promise.resolve(true)

				const propsPromise = saveProps(unsavedParams)

				const [textSaved, propsSaved] = await Promise.all([
					textPromise,
					propsPromise,
				])

				setSavedData((prev) => {
					return {
						...prev,
						content: textSaved ? params.contentStr : prev.content,
						comments: propsSaved ? params.commentsStr : prev.comments,
						llmMemories:
							propsSaved && params?.llmMemories
								? params?.llmMemories
								: prev.llmMemories,
						wordCount: propsSaved ? params.word_count : prev.wordCount,
					}
				})
				if (textSaved && propsSaved) {
					setLastSaved(new Date())
				}
				setForceSave(false)
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
			saveWorking,
			saveLocal,
			setSavedData,
			isTextSaved,
			saveProps,
			saveText,
			getUnsavedChapterSavingParams,
		]
	)

	useEffect(() => {
		if (!data?.chapter) {
			return
		}
		if (data.chapter.chapter_title) {
			setCurrentTitle(data.chapter.chapter_title)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [data])

	return {
		handleSave,
		isSaved,
		isPending: saveWorking,
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

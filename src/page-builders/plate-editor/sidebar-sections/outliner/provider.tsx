'use client'

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import {
	ACTION,
	EFeedback,
	EVENT_TYPE,
	SCREEN_NAME,
} from '@/constants/analytics'
import useEditorData from '@/hooks/plate/use-editor-data'
import useEpisodeContent from '@/hooks/query/use-episode-content'
import { useDebounce } from '@/hooks/use-debounce'
import useSocketStreaming from '@/hooks/use-socket-streaming'
import {
	convertStoryStateArrToMap,
	getStoryIdeaDataFromState,
	getStoryIdeaStateFromData,
} from '@/page-builders/episodes/outliner-questionnaire/lib/fns'
import useNewIdeas from '@/page-builders/episodes/outliner-questionnaire/lib/hooks/use-new-ideas'
import { TGetStoryIdeasResponse } from '@/page-builders/episodes/outliner-questionnaire/lib/types'
import useIsInitial from '@/page-builders/plate-editor/sidebar-sections/outliner/hooks/use-is-initial'
import useNarrativeArcsMutation from '@/page-builders/plate-editor/sidebar-sections/outliner/hooks/use-narrative-arcs-mutation'
import useNewIdeasSaving from '@/page-builders/plate-editor/sidebar-sections/outliner/hooks/use-new-ideas-mutation'
import useOutlinerChat from '@/page-builders/plate-editor/sidebar-sections/outliner/hooks/use-outliner-chat'
import useOutlinerData from '@/page-builders/plate-editor/sidebar-sections/outliner/hooks/use-outliner-data'
import useOutlinerEnabled from '@/page-builders/plate-editor/sidebar-sections/outliner/hooks/use-outliner-enabled'
import useSaveCachedOutlineMutation from '@/page-builders/plate-editor/sidebar-sections/outliner/hooks/use-save-cached-outline'
import useSummaryEpisodeV2Mutation from '@/page-builders/plate-editor/sidebar-sections/outliner/hooks/use-summary-episode-v2-mutation'
import useSummaryOutlineMutation from '@/page-builders/plate-editor/sidebar-sections/outliner/hooks/use-summary-outline-mutation'
import {
	areOutlinerTabDataEqual,
	convertOutlinerData,
	getCurrEpSummary,
	getOutlinerNewNarrativeArcsOptions,
} from '@/page-builders/plate-editor/sidebar-sections/outliner/lib/fns'
import {
	EOutlinerChatAction,
	EOutlinerChatMode,
	EOutlinerMode,
	EOutlinerTab,
	TOutlinerBeatEditable,
	TOutlinerChatGetNarrativeArcsResponse,
	TOutlinerChatMessage,
	TOutlinerChatStreamedNewIdea,
	TOutlinerChatStreamedResponseItem,
	TOutlinerData,
	TOutlinerFetchedData,
	TOutlinerScene,
	TOutlinerSceneEditable,
	TOutlinerTabData,
} from '@/page-builders/plate-editor/sidebar-sections/outliner/lib/types'
import useEpisodeIdStore from '@/store/episode-id-store'
import { X } from 'lucide-react'
import { useEditorRef } from 'platejs/react'
import { toast } from 'sonner'

import { OutlinerFeedback } from '@/components/outliner-feedback'
import { track } from '@/lib/utils/analytics'
import { parseOptimistically } from '@/lib/utils/helpers'
import { breakDownValue, jsonify } from '@/lib/utils/plate'

import { EAction, EMessenger, TAssistantMessage } from '@/types/ai-types'

function useOutlinerUtil() {
	const [fetchedData, setFetchedData] = useState<TOutlinerFetchedData>()
	const [outlinerData, setOutlinerData] = useState<TOutlinerData>()
	const [outlinerTabData, setOutlinerTabData] = useState<TOutlinerTabData>()
	const [selectedOutlinerTabData, setSelectedOutlinerTabData] =
		useState<TOutlinerTabData>()
	const [outlinerTab, setOutlinerTab] = useState<EOutlinerTab>(
		EOutlinerTab.VIEW
	)
	const [prompt, setPrompt] = useState('')
	const [messages, setMessages] = useState<Array<TOutlinerChatMessage>>([])
	const { mutateAsync: sendOutlinerChat, isPending: isOutlinerChatPending } =
		useOutlinerChat()
	const [taskGeneratedContentMap, setTaskGeneratedContentMap] = useState<
		Record<string, string>
	>({})

	const {
		storyIdeaDataState,
		setStoryIdeaDataState,
		isUpdateOutlinerStoryIdeaPending,
		savedStoryData,
		handleChangeStoryDataStateField,
	} = useNewIdeas()

	const isInitialOutlineDataFetched = useRef(false)
	const { mutateAsync: fetchOutlinerData, isPending: isOutlinerDataPending } =
		useOutlinerData()

	const { data: episodeData } = useEpisodeContent()
	const { setCurrentLLMMemories } = useEpisodeIdStore()
	const [outlinerChatMode, setOutlinerChatMode] = useState(
		EOutlinerChatMode.CHAT
	)
	const [newIdeasTaskId, setNewIdeasTaskId] = useState('')
	const [completedTaskId, setCompletedTaskId] = useState({
		newIdeas: '',
		newNarrativeArcs: '',
		outline: '',
		content: '',
	})
	const [newNarrativeArcsTaskId, setNewNarrativeArcsTaskId] = useState('')
	const { taskEnded, responses } = useSocketStreaming()

	const currentNewIdeas = useMemo(() => {
		return outlinerData?.[1]?.multiSelectOptions
	}, [outlinerData])

	const selectedStoryIdea = useMemo(() => {
		const selectedIdeaState = storyIdeaDataState[0]
		if (!selectedIdeaState) {
			return
		}
		const ideaData = getStoryIdeaDataFromState(selectedIdeaState)
		if (!ideaData) {
			return
		}
		return ideaData
	}, [storyIdeaDataState])

	const debouncedNewIdeas = useDebounce(currentNewIdeas, 500)
	const { mutate } = useNewIdeasSaving()
	const { mutateAsync: saveCachedOutline, isPending: isCachedScenesSaving } =
		useSaveCachedOutlineMutation()

	const editor = useEditorRef()
	const isInitialNewIdeasFetched = useRef(false)

	const isInitial = useIsInitial()

	const taskIdContextMap = useRef<
		Record<
			string,
			{
				mode?: string
				outlinerData?: TOutlinerData
				prompt?: string
				selectedOutlinerTabData?: TOutlinerTabData
			}
		>
	>({})
	const summaryOutlineTaskIdToSummary = useRef<Record<string, string>>({})
	const newIdeasTaskIdToRetry = useRef<Record<string, boolean>>({})
	const newNarrativeArcsTaskIdToRetry = useRef<Record<string, boolean>>({})

	const lastMessageTaskId = useMemo(() => {
		return (messages[messages.length - 1] as TAssistantMessage | undefined)
			?.taskId
	}, [messages])

	const lastMessageGeneratingNewIdeaIdx = useMemo(() => {
		if (!lastMessageTaskId || taskEnded[lastMessageTaskId]) {
			return
		}
		const selectedTab =
			taskIdContextMap.current[lastMessageTaskId].selectedOutlinerTabData
		const outlinerData =
			taskIdContextMap.current[lastMessageTaskId].outlinerData
		if (
			selectedTab?.summaryIdx !== undefined &&
			selectedTab.sceneIdx === undefined &&
			!outlinerData?.[selectedTab?.summaryIdx].summary &&
			!!outlinerData?.[selectedTab?.summaryIdx].multiSelectOptions?.length
		) {
			return outlinerData?.[selectedTab?.summaryIdx].multiSelectSelectedOption
		}
		return
	}, [lastMessageTaskId, taskEnded])

	const isStreaming = useMemo(() => {
		return !!lastMessageTaskId && !taskEnded[lastMessageTaskId]
	}, [taskEnded, lastMessageTaskId])

	const currentEpSummary = useMemo(() => {
		return outlinerData?.[1]?.summary
	}, [outlinerData])

	const narrativeArcsPlan = useMemo(() => {
		return outlinerData?.[2]?.summary
	}, [outlinerData])

	const debouncedNarrativeArcsPlan = useDebounce(narrativeArcsPlan)

	const { mutate: updateNarrativeArcs, isPending: isUpdatingNarrativeArcs } =
		useNarrativeArcsMutation()

	const {
		mutateAsync: startSummaryToEpisode,
		isPending: isSummaryEpisodeStarting,
	} = useSummaryEpisodeV2Mutation()
	const [summaryEpisodeTaskId, setSummaryEpisodeTaskId] = useState('')

	const {
		mutateAsync: startSummaryToOutline,
		isPending: isSummaryOutlinePending,
	} = useSummaryOutlineMutation()
	const [summaryOutlineTaskId, setSummaryOutlineTaskId] = useState('')

	const { editorText } = useEditorData()
	const searchParams = useSearchParams()
	const isUGC = !!searchParams.get('ugc')

	const previouslyParsedNewIdeas = useRef<
		Array<TOutlinerChatStreamedNewIdea> | undefined
	>(undefined)
	const storedGeneratedIdeasId = useRef('')

	const streamedNewIdeas = useMemo(() => {
		if (!newIdeasTaskId) {
			return
		}
		const responseStr = responses[newIdeasTaskId]?.join('')
		if (!responseStr) {
			return
		}

		const parsed = parseOptimistically(
			responseStr
		) as Array<TOutlinerChatStreamedNewIdea>
		if (!parsed) {
			return previouslyParsedNewIdeas.current
		}
		previouslyParsedNewIdeas.current = parsed

		return parsed
	}, [responses, newIdeasTaskId])

	const previouslyParsedNewNarrativeArcs = useRef<
		TOutlinerChatGetNarrativeArcsResponse | undefined
	>(undefined)
	const storedGeneratedNewNarrativeArcsId = useRef('')

	const streamedNewNarrativeArcs = useMemo(() => {
		if (!newNarrativeArcsTaskId) {
			return
		}
		const responseStr = responses[newNarrativeArcsTaskId]?.join('')
		if (!responseStr) {
			return
		}

		const parsed = parseOptimistically(
			responseStr
		) as TOutlinerChatGetNarrativeArcsResponse
		if (!parsed) {
			return previouslyParsedNewNarrativeArcs.current
		}
		previouslyParsedNewNarrativeArcs.current = parsed

		return parsed
	}, [responses, newNarrativeArcsTaskId])

	const isSummaryEpisodeGenerating = useMemo(() => {
		if (isSummaryEpisodeStarting) {
			return true
		}
		if (!summaryEpisodeTaskId || taskEnded[summaryEpisodeTaskId]) {
			return false
		}
		return true
	}, [isSummaryEpisodeStarting, summaryEpisodeTaskId, taskEnded])

	const isNewIdeaStreaming = useMemo(() => {
		return !!newIdeasTaskId && !taskEnded[newIdeasTaskId]
	}, [newIdeasTaskId, taskEnded])

	const isNewNarrativeArcsStreaming = useMemo(() => {
		return !!newNarrativeArcsTaskId && !taskEnded[newNarrativeArcsTaskId]
	}, [newNarrativeArcsTaskId, taskEnded])

	const outlinerDropDownOptions = useMemo(() => {
		const options = [EOutlinerChatMode.CHAT]
		if (
			!areOutlinerTabDataEqual(
				selectedOutlinerTabData || {},
				outlinerTabData || {}
			)
		) {
			options.push(EOutlinerChatMode.GENERATE_SELECTION)
			options.push(EOutlinerChatMode.GENERATE_CONTENT)
			if (
				outlinerTabData?.summaryIdx === undefined &&
				selectedOutlinerTabData?.summaryIdx === 1
			) {
				options.push(EOutlinerChatMode.EXPAND_OUTLINE)
			}
		}
		return options
	}, [selectedOutlinerTabData, outlinerTabData])

	const isLastGeneratingMessage = useCallback(
		({ summaryIdx, beatIdx, sceneIdx }: TOutlinerTabData) => {
			if (!lastMessageTaskId || taskEnded[lastMessageTaskId]) {
				return false
			}
			const selectedTab =
				taskIdContextMap.current[lastMessageTaskId].selectedOutlinerTabData
			return (
				selectedTab?.summaryIdx === summaryIdx &&
				selectedTab?.sceneIdx === sceneIdx &&
				selectedTab?.beatIdx === beatIdx
			)
		},
		[lastMessageTaskId, taskEnded]
	)

	const addMessage = useCallback(
		async ({ prompt }: { prompt: string }) => {
			setMessages((prev) => {
				return [
					...prev,
					{
						role: EMessenger.USER,
						content: prompt,
						context: selectedOutlinerTabData as TOutlinerTabData,
					},
				]
			})
			const taskId = await sendOutlinerChat({
				messages: messages,
				prompt,
				epText: editorText,
				mode: isUGC ? EOutlinerMode.UGC : EOutlinerMode.PGC,
				selection: selectedOutlinerTabData,
				outlinerData: outlinerData,
				previous_episode_context: fetchedData?.previous_episode_context || '',
				previous_episode_summary: fetchedData?.previous_episode_summary || '',
				selected_story_idea: selectedStoryIdea,
			})
			const mode = isUGC ? EOutlinerMode.UGC : EOutlinerMode.PGC
			track({
				event: EVENT_TYPE.BUTTON_CLICK,
				screenName: SCREEN_NAME.EPISODE_EDITOR,
				metaData: {
					action: ACTION.OUTLINER_CHAT_START,
					flowId: taskId,
					prompt,
					mode,
				},
			})
			taskIdContextMap.current[taskId] = {
				selectedOutlinerTabData,
				outlinerData,
				prompt,
				mode,
			}
			setMessages((prev) => {
				return [
					...prev,
					{
						role: EMessenger.ASSISTANT,
						action: EAction.BLOCK,
						taskId,
						content: '',
					},
				]
			})
		},
		[
			messages,
			outlinerData,
			selectedOutlinerTabData,
			sendOutlinerChat,
			editorText,
			isUGC,
			fetchedData,
			selectedStoryIdea,
		]
	)

	const handleOutlinerDataFetch = useCallback(async () => {
		if (
			!!outlinerData ||
			isOutlinerDataPending ||
			isInitialOutlineDataFetched.current
		) {
			return
		}
		isInitialOutlineDataFetched.current = true
		const fetchedOutlinerData = await fetchOutlinerData()
		if (!fetchedOutlinerData) {
			return
		}
		setFetchedData(fetchedOutlinerData)
		setOutlinerData(convertOutlinerData(fetchedOutlinerData))
	}, [fetchOutlinerData, outlinerData, isOutlinerDataPending])

	const isChatOpen = useMemo(() => {
		return outlinerTab === EOutlinerTab.GENERATE
	}, [outlinerTab])

	const isSomeSummaryZoomed = useMemo(() => {
		return outlinerTabData?.summaryIdx !== undefined
	}, [outlinerTabData])

	const openSummaryIdx = useMemo(() => {
		return outlinerTabData?.summaryIdx ?? selectedOutlinerTabData?.summaryIdx
	}, [outlinerTabData, selectedOutlinerTabData])

	const isSomeSceneZoomed = useMemo(() => {
		return outlinerTabData?.sceneIdx !== undefined
	}, [outlinerTabData])

	const openSceneIdx = useMemo(() => {
		return outlinerTabData?.sceneIdx ?? selectedOutlinerTabData?.sceneIdx
	}, [outlinerTabData, selectedOutlinerTabData])

	const selectedSummaryIdx = useMemo(() => {
		return outlinerTabData?.summaryIdx ?? -1
	}, [outlinerTabData])

	const selectedSceneIdx = useMemo(() => {
		return outlinerTabData?.sceneIdx ?? -1
	}, [outlinerTabData])

	const handleSummarySelect = useCallback(
		(summaryIdx: number) => {
			if (isSomeSummaryZoomed) {
				return
			}
			setSelectedOutlinerTabData((prev) => {
				if (prev?.summaryIdx === summaryIdx) {
					return undefined
				} else {
					return {
						summaryIdx,
					}
				}
			})
		},
		[setSelectedOutlinerTabData, isSomeSummaryZoomed]
	)

	const shouldShowSummaryAccordion = useCallback(
		(idx: number) => {
			if (!isSomeSummaryZoomed) {
				return true
			}
			return openSummaryIdx === idx
		},
		[isSomeSummaryZoomed, openSummaryIdx]
	)

	const startNewIdeasGeneration = useCallback(
		async (retry = false) => {
			if (newIdeasTaskId) {
				return
			}
			toast.info('Generating New Ideas!')
			const taskId = await sendOutlinerChat({
				messages: messages,
				prompt: '',
				epText: editorText,
				mode: isUGC ? EOutlinerMode.UGC : EOutlinerMode.PGC,
				selection: selectedOutlinerTabData,
				outlinerData: outlinerData,
				action: EOutlinerChatAction.GENERATE_NEW_IDEAS,
				retry,
				previous_episode_context: fetchedData?.previous_episode_context || '',
				previous_episode_summary: fetchedData?.previous_episode_summary || '',
				selected_story_idea: selectedStoryIdea,
			})
			newIdeasTaskIdToRetry.current[taskId] = retry
			track({
				event: EVENT_TYPE.BUTTON_CLICK,
				screenName: SCREEN_NAME.EPISODE_EDITOR,
				metaData: {
					action: ACTION.OUTLINER_NEW_IDEAS_START,
					flowId: taskId,
					retry,
				},
			})
			setNewIdeasTaskId(taskId)
		},
		[
			outlinerData,
			selectedOutlinerTabData,
			messages,
			isUGC,
			newIdeasTaskId,
			editorText,
			sendOutlinerChat,
			fetchedData,
			selectedStoryIdea,
		]
	)

	const startNewNarrativeArcsGeneration = useCallback(
		async (retry = false) => {
			if (newNarrativeArcsTaskId) {
				return
			}
			toast.info('Generating New Narrative Arcs Plan!')
			const taskId = await sendOutlinerChat({
				messages: messages,
				prompt: '',
				epText: editorText,
				mode: isUGC ? EOutlinerMode.UGC : EOutlinerMode.PGC,
				selection: selectedOutlinerTabData,
				outlinerData: outlinerData,
				action: EOutlinerChatAction.GENERATE_NARRATIVE_ARCS_PLAN,
				retry,
				previous_episode_context: fetchedData?.previous_episode_context || '',
				previous_episode_summary: fetchedData?.previous_episode_summary || '',
				selected_story_idea: selectedStoryIdea,
			})
			newNarrativeArcsTaskIdToRetry.current[taskId] = retry
			track({
				event: EVENT_TYPE.BUTTON_CLICK,
				screenName: SCREEN_NAME.EPISODE_EDITOR,
				metaData: {
					action: ACTION.OUTLINER_NARRATIVE_ARCS_START,
					flowId: taskId,
					retry,
				},
			})
			setNewNarrativeArcsTaskId(taskId)
		},
		[
			outlinerData,
			selectedOutlinerTabData,
			messages,
			isUGC,
			newNarrativeArcsTaskId,
			editorText,
			sendOutlinerChat,
			fetchedData,
			selectedStoryIdea,
		]
	)

	const handleInitialNewIdeasFetch = useCallback(
		(newIdeas: TGetStoryIdeasResponse) => {
			if (isInitialNewIdeasFetched.current) {
				return
			}
			if ('result' in newIdeas && newIdeas?.result?.new_story_ideas?.length) {
				const storyIdeas = newIdeas.result.new_story_ideas.map(
					getStoryIdeaStateFromData
				)
				setStoryIdeaDataState(storyIdeas)
				savedStoryData.current = convertStoryStateArrToMap(storyIdeas)
			}
			isInitialNewIdeasFetched.current = true
		},
		[setStoryIdeaDataState, savedStoryData]
	)

	const handleNewIdeaChange = useCallback(
		({
			optionIdx,
			summaryIdx,
			value,
		}: {
			optionIdx: number
			summaryIdx: number
			value: string
		}) => {
			setOutlinerData((prev) => {
				if (!prev) {
					return prev
				}

				const newData = prev.map((item, sIdx) => {
					if (sIdx !== summaryIdx) {
						return item
					}

					const newMultiSelectOptions = item.multiSelectOptions?.map(
						(opt, oIdx) =>
							oIdx === optionIdx ? { ...opt, summary: value } : opt
					)

					return {
						...item,
						multiSelectOptions: newMultiSelectOptions,
					}
				})

				return newData as TOutlinerData
			})
		},
		[]
	)

	const handleNewIdeaReject = useCallback(
		({ optionIdx, summaryIdx }: { optionIdx?: number; summaryIdx: number }) => {
			if (optionIdx === undefined) {
				return
			}
			setOutlinerData((prev) => {
				const newData = Array.isArray(prev) ? [...prev] : []

				const target = newData[summaryIdx]
				if (!target || !Array.isArray(target.multiSelectOptions)) {
					return prev
				}

				const updatedOptions = target.multiSelectOptions.filter(
					(_, idx) => idx !== optionIdx
				)

				newData[summaryIdx] = {
					...target,
					multiSelectOptions: updatedOptions,
				}

				return newData as TOutlinerData
			})
			toast.success(`Rejected Idea ${optionIdx + 1}`)
		},
		[]
	)

	const handleNewIdeaAccept = useCallback(
		({ optionIdx, summaryIdx }: { optionIdx?: number; summaryIdx: number }) => {
			if (optionIdx === undefined) {
				return
			}
			setOutlinerData((prev) => {
				const newData = [...(prev || [])]
				const option = newData?.[summaryIdx].multiSelectOptions
				if (!newData?.[summaryIdx].multiSelectOptions?.[optionIdx] || !option) {
					return
				}
				newData[summaryIdx] = {
					...newData[summaryIdx],
					...(summaryIdx === 1 ? { title: 'Current Episode' } : {}),
					multiSelectOptions: undefined,
					summary: option[optionIdx].summary,
				}
				return newData as TOutlinerData
			})
			toast.success(`Accepted Idea ${optionIdx + 1}`)
		},
		[]
	)

	const handleNewIdeaNavigate = useCallback(
		({ optionIdx, summaryIdx }: { optionIdx?: number; summaryIdx: number }) => {
			if (optionIdx === undefined) {
				return
			}
			setOutlinerData((prev) => {
				if (!prev) {
					return prev
				}

				return prev.map((item, idx) => {
					if (idx !== summaryIdx) {
						return item
					}

					return {
						...item,
						multiSelectSelectedOption: optionIdx,
					}
				}) as TOutlinerData
			})
		},
		[]
	)

	const handleSummaryValueChange = useCallback(
		({ value, summaryIdx }: { summaryIdx: number; value: string }) => {
			setOutlinerData((prev) => {
				const newData = [...(prev || [])]
				newData[summaryIdx].summary = value
				return newData as TOutlinerData
			})
		},
		[]
	)

	const handleGenerateOutline = useCallback(
		async ({ summaryIdx }: { summaryIdx: number }) => {
			if (summaryOutlineTaskId || isSummaryOutlinePending) {
				return
			}
			setOutlinerData((prev) => {
				const newData = Array.isArray(prev) ? [...prev] : []

				const target = newData[summaryIdx]
				if (!target) {
					return prev
				}
				newData[summaryIdx] = {
					...target,
					scenes: [],
				}

				return newData as TOutlinerData
			})
			toast.info('Outline generation will start!')
			const taskId = await startSummaryToOutline({
				narrative_arc_plan: outlinerData?.[2]?.summary,
				context:
					(fetchedData?.previous_episode_context ?? '') +
					' ' +
					(fetchedData?.previous_episode_summary ?? ''),
				chapter_id: episodeData?.chapter?.id || 0,
				episode_number: episodeData?.chapter?.seq_number || 0,
				project_id: episodeData?.chapter?.project || 0,
				summary: getCurrEpSummary(outlinerData) || '',
				input_language: episodeData?.chapter?.language,
				selected_story_idea: selectedStoryIdea,
			})
			if (taskId) {
				const summary = getCurrEpSummary(outlinerData) || ''
				summaryOutlineTaskIdToSummary.current[taskId] = summary
				track({
					event: EVENT_TYPE.BUTTON_CLICK,
					screenName: SCREEN_NAME.EPISODE_EDITOR,
					metaData: {
						action: ACTION.OUTLINER_GENERATE_OUTLINE_START,
						flowId: taskId,
						summary,
					},
				})
				setSummaryOutlineTaskId(taskId)
			}
			setOutlinerTabData({ summaryIdx })
		},
		[
			episodeData,
			outlinerData,
			summaryOutlineTaskId,
			fetchedData,
			isSummaryOutlinePending,
			startSummaryToOutline,
			selectedStoryIdea,
		]
	)

	const handleGenerateContentFromSummary = useCallback(async () => {
		if (summaryEpisodeTaskId) {
			return
		}
		toast.info('Content generation will start!')
		const taskId = await startSummaryToEpisode({
			summary: getCurrEpSummary(outlinerData),
			input_language: episodeData?.chapter?.language,
			narrative_arc_plan: outlinerData?.[2]?.summary,
			prev_episode_summary: outlinerData?.[0]?.summary,
			context:
				(fetchedData?.previous_episode_context ?? '') +
				' ' +
				(fetchedData?.previous_episode_summary ?? ''),
			chapter_id: episodeData?.chapter?.id || 0,
			project_id: episodeData?.chapter?.project || 0,
			episode_number: episodeData?.chapter?.seq_number || 0,
			scenes: outlinerData?.[1]?.scenes || [],
			selected_story_idea: selectedStoryIdea,
		})
		track({
			event: EVENT_TYPE.BUTTON_CLICK,
			screenName: SCREEN_NAME.EPISODE_EDITOR,
			metaData: {
				action: ACTION.OUTLINER_GENERATE_CONTENT_START,
				flowId: taskId,
			},
		})
		setSummaryEpisodeTaskId(taskId)
	}, [
		outlinerData,
		summaryEpisodeTaskId,
		episodeData,
		startSummaryToEpisode,
		fetchedData,
		selectedStoryIdea,
	])

	const handleBeatChange = useCallback(
		({
			sceneIdx,
			summaryIdx,
			value,
			beatIdx,
			beatKey,
		}: {
			beatIdx: number
			beatKey: TOutlinerBeatEditable
			sceneIdx: number
			summaryIdx: number
			value: string
		}) => {
			setOutlinerData((prev) => {
				const newData = [...(prev || [])]
				const beat = newData[summaryIdx]?.scenes?.[sceneIdx]?.beats?.[beatIdx]
				if (
					!newData[summaryIdx]?.scenes?.[sceneIdx]?.beats?.[beatIdx] ||
					!beat
				) {
					return prev
				}
				newData[summaryIdx].scenes[sceneIdx].beats[beatIdx][beatKey] = value
				return newData as TOutlinerData
			})
		},
		[]
	)

	const handleSceneSelect = useCallback(
		(sceneIdx: number) => {
			if (isSomeSceneZoomed) {
				return
			}
			setSelectedOutlinerTabData((prev) => {
				return {
					...prev,
					sceneIdx: sceneIdx === prev?.sceneIdx ? undefined : sceneIdx,
				}
			})
		},
		[setSelectedOutlinerTabData, isSomeSceneZoomed]
	)

	const shouldShowSceneAccordion = useCallback(
		(idx: number) => {
			if (!isSomeSceneZoomed) {
				return true
			}
			return openSceneIdx === idx
		},
		[isSomeSceneZoomed, openSceneIdx]
	)

	const handleSceneChange = useCallback(
		({
			sceneIdx,
			summaryIdx,
			value,
			key,
		}: {
			key: TOutlinerSceneEditable
			sceneIdx: number
			summaryIdx: number
			value: string
		}) => {
			setOutlinerData((prev) => {
				const newData = [...(prev || [])]
				const scene = newData[summaryIdx]?.scenes?.[sceneIdx]
				if (!newData[summaryIdx]?.scenes?.[sceneIdx] || !scene) {
					return prev
				}
				newData[summaryIdx].scenes[sceneIdx] = {
					...scene,
					[key]: value,
				}
				return newData as TOutlinerData
			})
		},
		[]
	)

	const handleChangeGeneratedContent = useCallback(
		({ content, taskId }: { content: string; taskId: string }) => {
			setTaskGeneratedContentMap((prev) => {
				return {
					...prev,
					[taskId]: content,
				}
			})
		},
		[]
	)

	const handleCompleteContentGeneration = useCallback(
		async ({ accepted }: { accepted?: boolean }) => {
			setSummaryEpisodeTaskId('')
			if (!accepted) {
				toast.info('Content generation stopped!')
				return
			}
			toast.info('Generated Content inserted in the editor!')
			if (!outlinerData?.[1]?.scenes?.length) {
				const savedScenes = await saveCachedOutline()
				if (savedScenes?.scenes) {
					setOutlinerData((prev) => {
						const newData = Array.isArray(prev) ? [...prev] : []

						const target = newData[1]
						if (!target) {
							return prev
						}
						newData[1] = {
							...target,
							scenes: savedScenes?.scenes,
						}

						return newData as TOutlinerData
					})
				}
				toast.success('Outline created from generated content!')
			}
		},
		[saveCachedOutline, outlinerData]
	)

	useEffect(() => {
		setSelectedOutlinerTabData(outlinerTabData)
	}, [outlinerTabData])

	useEffect(() => {
		if (outlinerDropDownOptions.includes(outlinerChatMode)) {
			return
		}
		setOutlinerChatMode(EOutlinerChatMode.CHAT)
	}, [outlinerDropDownOptions, outlinerChatMode])

	useEffect(() => {
		if (!lastMessageTaskId || !taskEnded[lastMessageTaskId]) {
			return
		}
		const messageResponseStr = responses[lastMessageTaskId]?.join('') || ''
		const context = taskIdContextMap.current[lastMessageTaskId]
		const prompt = context?.prompt || ''
		const mode =
			context?.mode || (isUGC ? EOutlinerMode.UGC : EOutlinerMode.PGC)
		track({
			event: EVENT_TYPE.BUTTON_CLICK,
			screenName: SCREEN_NAME.EPISODE_EDITOR,
			metaData: {
				action: ACTION.OUTLINER_CHAT_END,
				flowId: lastMessageTaskId,
				prompt,
				response: messageResponseStr,
				mode,
			},
		})
	}, [lastMessageTaskId, taskEnded, responses, isUGC])

	useEffect(() => {
		if (
			!lastMessageTaskId ||
			taskEnded[lastMessageTaskId] ||
			!responses[lastMessageTaskId]
		) {
			return
		}
		const messageResponseStr = responses[lastMessageTaskId].join('')

		if (!messageResponseStr) {
			return
		}
		const parsedMessageResponse = parseOptimistically(messageResponseStr) as
			| Partial<TOutlinerChatStreamedResponseItem>
			| undefined

		if (!parsedMessageResponse) {
			return
		}

		const messageText = parsedMessageResponse.message

		if (messageText) {
			setMessages((prev) => {
				if (!prev) {
					return prev
				}
				const newData = prev.map((item) => {
					if (!('taskId' in item) || item.taskId !== lastMessageTaskId) {
						return item
					}
					const newChunk = item.content
						? messageText.split(item.content)[1] || ''
						: messageText

					if (!newChunk) {
						return item
					}
					return {
						...item,
						outlinerAction: parsedMessageResponse.action,
						content: messageText,
						chunks: [...(item.chunks || []), newChunk ?? ''],
					}
				})

				return newData
			})
		}

		if (parsedMessageResponse.action === EOutlinerChatAction.HIGHLIGHT) {
			const bodyText = parsedMessageResponse.body

			const selectedOutlinerTabData =
				taskIdContextMap.current[lastMessageTaskId]?.selectedOutlinerTabData ??
				{}
			if (!bodyText) {
				return
			}

			const sentOutlinerData =
				taskIdContextMap.current[lastMessageTaskId]?.outlinerData

			setOutlinerData((prev) => {
				if (!prev) {
					return prev
				}
				const newData = [...prev]
				if (
					selectedOutlinerTabData?.summaryIdx !== undefined &&
					newData[selectedOutlinerTabData.summaryIdx]
				) {
					if (
						selectedOutlinerTabData?.sceneIdx !== undefined &&
						newData[selectedOutlinerTabData.summaryIdx].scenes
					) {
						if (
							selectedOutlinerTabData?.beatIdx !== undefined &&
							newData[selectedOutlinerTabData.summaryIdx].scenes?.[
								selectedOutlinerTabData?.sceneIdx
							].beats?.[selectedOutlinerTabData?.beatIdx]
						) {
							// TODO
							return newData
						}
						// TODO
						return newData
					}
					if (
						!sentOutlinerData?.[selectedOutlinerTabData.summaryIdx].summary &&
						!!sentOutlinerData?.[selectedOutlinerTabData.summaryIdx]
							.multiSelectOptions?.length
					) {
						const selectedIdx =
							sentOutlinerData?.[selectedOutlinerTabData.summaryIdx]
								.multiSelectSelectedOption || 0
						const newOptions = (
							sentOutlinerData?.[selectedOutlinerTabData.summaryIdx]
								.multiSelectOptions || []
						)?.map((item, idx) => {
							if (idx !== selectedIdx) {
								return item
							}
							return {
								...item,
								summary: bodyText,
							}
						})
						newData[selectedOutlinerTabData.summaryIdx] = {
							...newData[selectedOutlinerTabData.summaryIdx],
							multiSelectOptions: newOptions,
						}
					} else {
						newData[selectedOutlinerTabData.summaryIdx].summary = bodyText
					}
				}
				return newData
			})
		}
	}, [lastMessageTaskId, responses, taskEnded])

	useEffect(() => {
		if (!newIdeasTaskId || !taskEnded[newIdeasTaskId]) {
			return
		}
		const responseStr = responses[newIdeasTaskId]?.join('') || ''
		const retry = newIdeasTaskIdToRetry.current[newIdeasTaskId] ?? false
		track({
			event: EVENT_TYPE.BUTTON_CLICK,
			screenName: SCREEN_NAME.EPISODE_EDITOR,
			metaData: {
				action: ACTION.OUTLINER_NEW_IDEAS_END,
				flowId: newIdeasTaskId,
				response: responseStr,
				retry,
			},
		})
		delete newIdeasTaskIdToRetry.current[newIdeasTaskId]
	}, [newIdeasTaskId, taskEnded, responses])

	useEffect(() => {
		if (
			isNewIdeaStreaming ||
			!newIdeasTaskId ||
			!streamedNewIdeas ||
			storedGeneratedIdeasId.current === newIdeasTaskId
		) {
			return
		}
		setOutlinerData((prev) => {
			const newData = [...(prev ?? [])]
			if (!newData[1]) {
				return prev
			}
			newData[1] = {
				...newData[1],
				multiSelectOptions: [
					...streamedNewIdeas,
					{
						title: 'Your Own Idea',
						summary: '',
					},
				],
			}
			return newData
		})
		setNewIdeasTaskId('')
		setCompletedTaskId((prev) => {
			return {
				...prev,
				newIdeas: newIdeasTaskId,
			}
		})
		toast.info('Generated New Ideas!')
		storedGeneratedIdeasId.current = newIdeasTaskId
		previouslyParsedNewIdeas.current = undefined
	}, [isNewIdeaStreaming, streamedNewIdeas, newIdeasTaskId])

	useEffect(() => {
		if (!newNarrativeArcsTaskId || !taskEnded[newNarrativeArcsTaskId]) {
			return
		}
		const responseStr = responses[newNarrativeArcsTaskId]?.join('') || ''
		const retry =
			newNarrativeArcsTaskIdToRetry.current[newNarrativeArcsTaskId] ?? false
		track({
			event: EVENT_TYPE.BUTTON_CLICK,
			screenName: SCREEN_NAME.EPISODE_EDITOR,
			metaData: {
				action: ACTION.OUTLINER_NARRATIVE_ARCS_END,
				flowId: newNarrativeArcsTaskId,
				response: responseStr,
				retry,
			},
		})
		delete newNarrativeArcsTaskIdToRetry.current[newNarrativeArcsTaskId]
	}, [newNarrativeArcsTaskId, taskEnded, responses])

	useEffect(() => {
		if (
			isNewNarrativeArcsStreaming ||
			!newNarrativeArcsTaskId ||
			!streamedNewNarrativeArcs ||
			storedGeneratedNewNarrativeArcsId.current === newNarrativeArcsTaskId
		) {
			return
		}
		setOutlinerData((prev) => {
			const newData = [...(prev ?? [])]
			if (!newData[2]) {
				return prev
			}
			newData[2] = {
				...newData[2],
				multiSelectOptions: [
					...getOutlinerNewNarrativeArcsOptions({
						newNarrativeArcs: streamedNewNarrativeArcs || [],
					}),
					{
						title: 'Your Own Narrative Arc Plan',
						summary: '',
					},
				],
			}
			return newData
		})
		setNewNarrativeArcsTaskId('')
		setCompletedTaskId((prev) => {
			return {
				...prev,
				newNarrativeArcs: newNarrativeArcsTaskId,
			}
		})
		toast.info('Generated New Narrative Arc Plans!')
		storedGeneratedNewNarrativeArcsId.current = newNarrativeArcsTaskId
		previouslyParsedNewNarrativeArcs.current = undefined
	}, [
		isNewNarrativeArcsStreaming,
		streamedNewNarrativeArcs,
		newNarrativeArcsTaskId,
	])

	useEffect(() => {
		if (currentEpSummary === undefined) {
			return
		}
		setCurrentLLMMemories({
			summary: currentEpSummary,
		})
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentEpSummary])

	useEffect(() => {
		if (!debouncedNarrativeArcsPlan) {
			return
		}
		updateNarrativeArcs({ content: debouncedNarrativeArcsPlan })
	}, [updateNarrativeArcs, debouncedNarrativeArcsPlan])

	useEffect(() => {
		if (!debouncedNewIdeas?.length) {
			return
		}
		mutate({
			new_episode_ideas: debouncedNewIdeas,
		})
	}, [debouncedNewIdeas, mutate])

	useEffect(() => {
		if (!summaryOutlineTaskId || !responses[summaryOutlineTaskId]) {
			return
		}
		const responsesArray = responses[summaryOutlineTaskId]
		const responsesStr = responsesArray.join('')

		const parsed = parseOptimistically(responsesStr) as
			| { scenes: TOutlinerScene[] }
			| undefined

		if (parsed && parsed.scenes && parsed.scenes.length) {
			setOutlinerData((prev) => {
				const newData = [...(prev || [])]
				newData[1].scenes = parsed.scenes
				return newData
			})
		}
		if (taskEnded[summaryOutlineTaskId]) {
			const summary =
				summaryOutlineTaskIdToSummary.current[summaryOutlineTaskId] || ''
			const responseStr = responsesArray.join('')
			track({
				event: EVENT_TYPE.BUTTON_CLICK,
				screenName: SCREEN_NAME.EPISODE_EDITOR,
				metaData: {
					action: ACTION.OUTLINER_GENERATE_OUTLINE_END,
					flowId: summaryOutlineTaskId,
					response: responseStr,
					summary,
				},
			})
			delete summaryOutlineTaskIdToSummary.current[summaryOutlineTaskId]
			setCompletedTaskId((prev) => {
				return {
					...prev,
					outline: summaryOutlineTaskId,
				}
			})
			toast.success('Outline Generated Successfully!')
			setSummaryOutlineTaskId('')
		}
	}, [taskEnded, responses, summaryOutlineTaskId])

	useEffect(() => {
		if (!summaryEpisodeTaskId || !responses[summaryEpisodeTaskId]) {
			return
		}
		const responseArray = responses[summaryEpisodeTaskId]
		const responseStr = responseArray?.join('')

		if (responseStr) {
			editor.tf.setValue(breakDownValue(jsonify(responseStr)))
		}

		if (taskEnded[summaryEpisodeTaskId]) {
			const currentTaskId = summaryEpisodeTaskId
			track({
				event: EVENT_TYPE.BUTTON_CLICK,
				screenName: SCREEN_NAME.EPISODE_EDITOR,
				metaData: {
					action: ACTION.OUTLINER_GENERATE_CONTENT_END,
					flowId: currentTaskId,
					response: responseStr || '',
				},
			})
			setCompletedTaskId((prev) => {
				return {
					...prev,
					content: currentTaskId,
				}
			})
			const handleFeedback = (feedback: EFeedback, comment?: string) => {
				track({
					event: EVENT_TYPE.BUTTON_CLICK,
					screenName: SCREEN_NAME.EPISODE_EDITOR,
					metaData: {
						action: ACTION.OUTLINER_GENERATE_CONTENT_USER_FEEDBACK,
						flowId: currentTaskId,
						feedback,
						comment,
					},
				})
				toast.dismiss(currentTaskId)
			}
			toast(`How was the generated content?`, {
				id: currentTaskId,
				action: (
					<>
						<div className="[--color-fm-button-shadow-secondary:transparent] [--color-fm-icon-active:var(--color-fm-icon-contrast)]">
							<OutlinerFeedback
								disablePopover
								onLike={(comment?: string) =>
									handleFeedback(EFeedback.LIKE, comment)
								}
								onDislike={(comment?: string) =>
									handleFeedback(EFeedback.DISLIKE, comment)
								}
							/>
						</div>
						<X
							className="absolute top-1 right-1 z-10 cursor-pointer"
							onClick={() => toast.dismiss(currentTaskId)}
							size={12}
						/>
					</>
				),
				duration: Infinity,
			})
			void handleCompleteContentGeneration({ accepted: true })
		}
	}, [
		taskEnded,
		responses,
		summaryEpisodeTaskId,
		handleCompleteContentGeneration,
		editor.tf,
	])

	useEffect(() => {
		setSelectedOutlinerTabData({
			summaryIdx: 0,
		})
	}, [isInitial])

	const handleChatFeedback = useCallback(
		(taskId: string, feedback: EFeedback, comment?: string) => {
			track({
				event: EVENT_TYPE.BUTTON_CLICK,
				screenName: SCREEN_NAME.EPISODE_EDITOR,
				metaData: {
					action: ACTION.OUTLINER_CHAT_USER_FEEDBACK,
					flowId: taskId,
					feedback,
					comment,
				},
			})
		},
		[]
	)

	const handleNewIdeasFeedback = useCallback(
		(feedback: EFeedback, comment?: string) => {
			if (!completedTaskId.newIdeas) {
				return
			}
			track({
				event: EVENT_TYPE.BUTTON_CLICK,
				screenName: SCREEN_NAME.EPISODE_EDITOR,
				metaData: {
					action: ACTION.OUTLINER_NEW_IDEAS_USER_FEEDBACK,
					flowId: completedTaskId.newIdeas,
					feedback,
					comment,
				},
			})
		},
		[completedTaskId.newIdeas]
	)

	const handleNarrativeArcsFeedback = useCallback(
		(feedback: EFeedback, comment?: string) => {
			if (!completedTaskId.newNarrativeArcs) {
				return
			}
			track({
				event: EVENT_TYPE.BUTTON_CLICK,
				screenName: SCREEN_NAME.EPISODE_EDITOR,
				metaData: {
					action: ACTION.OUTLINER_NARRATIVE_ARCS_USER_FEEDBACK,
					flowId: completedTaskId.newNarrativeArcs,
					feedback,
					comment,
				},
			})
		},
		[completedTaskId.newNarrativeArcs]
	)

	const handleOutlineFeedback = useCallback(
		(feedback: EFeedback, comment?: string) => {
			if (!completedTaskId.outline) {
				return
			}
			track({
				event: EVENT_TYPE.BUTTON_CLICK,
				screenName: SCREEN_NAME.EPISODE_EDITOR,
				metaData: {
					action: ACTION.OUTLINER_GENERATE_OUTLINE_USER_FEEDBACK,
					flowId: completedTaskId.outline,
					feedback,
					comment,
				},
			})
		},
		[completedTaskId.outline]
	)

	const handleContentFeedback = useCallback(
		(feedback: EFeedback, comment?: string) => {
			if (!completedTaskId.content) {
				return
			}
			track({
				event: EVENT_TYPE.BUTTON_CLICK,
				screenName: SCREEN_NAME.EPISODE_EDITOR,
				metaData: {
					action: ACTION.OUTLINER_GENERATE_CONTENT_USER_FEEDBACK,
					flowId: completedTaskId.content,
					feedback,
					comment,
				},
			})
		},
		[completedTaskId.content]
	)

	return {
		outlinerData,
		setOutlinerData,
		outlinerTab,
		setOutlinerTab,
		outlinerTabData,
		setOutlinerTabData,
		selectedOutlinerTabData,
		setSelectedOutlinerTabData,
		prompt,
		setPrompt,
		messages,
		setMessages,
		addMessage,
		isOutlinerChatPending: isOutlinerChatPending || isStreaming,
		outlinerChatMode,
		setOutlinerChatMode,
		outlinerDropDownOptions,
		shouldShowSummaryAccordion,
		isChatOpen,
		isSomeSummaryZoomed,
		handleSummarySelect,
		openSummaryIdx,
		handleNewIdeaChange,
		handleNewIdeaReject,
		handleNewIdeaAccept,
		handleNewIdeaNavigate,
		handleSummaryValueChange,
		handleGenerateOutline,
		handleGenerateContentFromSummary,
		selectedSummaryIdx,
		selectedSceneIdx,
		isSomeSceneZoomed,
		openSceneIdx,
		shouldShowSceneAccordion,
		handleSceneSelect,
		handleSceneChange,
		startNewIdeasGeneration,
		newIdeasTaskId,
		streamedNewIdeas,
		isNewIdeaStreaming,
		isStreaming,
		lastMessageGeneratingNewIdeaIdx,
		isLastGeneratingMessage,
		isSummaryEpisodeGenerating,
		summaryEpisodeTaskId,
		handleChangeGeneratedContent,
		taskGeneratedContentMap,
		handleCompleteContentGeneration,
		setFetchedData,
		summaryOutlineTaskId,
		handleBeatChange,
		isSummaryOutlinePending,
		isCachedScenesSaving,
		isUpdatingNarrativeArcs,
		debouncedNarrativeArcsPlan,
		startNewNarrativeArcsGeneration,
		newNarrativeArcsTaskId,
		isNewNarrativeArcsStreaming,
		streamedNewNarrativeArcs,
		handleOutlinerDataFetch,
		isOutlinerDataPending,
		handleInitialNewIdeasFetch,
		storyIdeaDataState,
		isUpdateOutlinerStoryIdeaPending,
		handleChangeStoryDataStateField,
		handleChatFeedback,
		handleNewIdeasFeedback,
		handleNarrativeArcsFeedback,
		handleOutlineFeedback,
		handleContentFeedback,
		taskEnded,
		completedTaskId,
	}
}

type TOutlinerContextValue = ReturnType<typeof useOutlinerUtil>

const OutlinerContext = React.createContext<TOutlinerContextValue | null>(null)

function OutlineUtilContextProvider({ children }: React.PropsWithChildren) {
	const value = useOutlinerUtil()

	return (
		<OutlinerContext.Provider value={value}>
			{children}
		</OutlinerContext.Provider>
	)
}

export function OutlineContextProvider({ children }: React.PropsWithChildren) {
	const enabled = useOutlinerEnabled()

	if (!enabled) {
		return children
	}

	return <OutlineUtilContextProvider>{children}</OutlineUtilContextProvider>
}

export default function useOutliner() {
	const context = React.useContext(OutlinerContext)

	if (!context) {
		throw new Error('useOutliner must be used inside OutlineContextProvider!')
	}

	return context
}

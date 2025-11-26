'use client'

import React, {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useRef,
	useState,
} from 'react'
import {
	ACTION,
	EFeedback,
	EVENT_TYPE,
	SCREEN_NAME,
} from '@/constants/analytics'
import { OUTLINER_QUESTIONNAIRE_PROFILE_QUERY_KEY } from '@/constants/query-constants'
import { useDebounce } from '@/hooks/use-debounce'
import useSocketStreaming from '@/hooks/use-socket-streaming'
import {
	EMPTY_STORY_DATA,
	INITIAL_CHAT_MESSAGE,
} from '@/page-builders/episodes/outliner-questionnaire/lib/constants'
import {
	convertBEChatToFE,
	convertStoryStateArrToMap,
	convertWritersProfileBeToFe,
	convertWritersProfileFeToBe,
	getDerivedChatMessage,
	getStoryIdeaDataFromState,
	getStoryIdeaStateFromData,
	getWriterProfileDataFromState,
	getWriterProfileStateFromData,
	isWriterProfileLoaded,
	updateLast,
} from '@/page-builders/episodes/outliner-questionnaire/lib/fns'
import useCompleteOnboarding from '@/page-builders/episodes/outliner-questionnaire/lib/hooks/use-complete-onboarding'
import useNewIdeas from '@/page-builders/episodes/outliner-questionnaire/lib/hooks/use-new-ideas'
import { useOutlinerQuestionnaireChat } from '@/page-builders/episodes/outliner-questionnaire/lib/hooks/use-outliner-questionnaire-chat'
import { useOutlinerQuestionnaireNewIdeasRegenerationMutation } from '@/page-builders/episodes/outliner-questionnaire/lib/hooks/use-outliner-questionnaire-new-ideas'
import { useOutlinerQuestionnaireProfileMutation } from '@/page-builders/episodes/outliner-questionnaire/lib/hooks/use-outliner-questionnaire-profile'
import { useOutlinerQuestionnaireStatusMutation } from '@/page-builders/episodes/outliner-questionnaire/lib/hooks/use-outliner-questionnaire-status'
import {
	useOutlinerQuestionnaireSurveyGenerateOptionsMutation,
	useOutlinerQuestionnaireSurveyQuestionsMutation,
} from '@/page-builders/episodes/outliner-questionnaire/lib/hooks/use-outliner-questionnaire-survey'
import {
	EOutlinerQuestionnaireTab,
	TGetOutlinerQuestionnaireStatus,
	TGetOutlinerQuestionnaireSurveyResponse,
	TGetStoryIdeasResponse,
	TOutlinerSurveyQuestion,
	TPostOutlinerQuestionnaireChatResponse,
	TStoryIdeaData,
	TWriterProfileDataBE,
	TWriterProfileDataStateItem,
	TWriterProfileKey,
	TWriterProfileState,
} from '@/page-builders/episodes/outliner-questionnaire/lib/types'
import { useQueryClient } from '@tanstack/react-query'
import { isEqual } from 'lodash'
import { toast } from 'sonner'

import useEpisodeTableContext from '@/providers/episode-table-provider'
import { track } from '@/lib/utils/analytics'
import { parseOptimistically } from '@/lib/utils/helpers'

import { EAction, EMessenger, TMessage } from '@/types/ai-types'

function useOutlinerQuestionnaireUtil() {
	const [outlinerQuestionnaireTab, setOutlinerQuestionnaireTab] = useState(
		EOutlinerQuestionnaireTab.START
	)
	const [messages, setMessages] = useState<TMessage[]>([INITIAL_CHAT_MESSAGE])
	const [inputPrompt, setInputPrompt] = useState('')

	const [questionsData, setQuestionsData] =
		useState<TGetOutlinerQuestionnaireSurveyResponse['result']>()
	const [currentIdx, setCurrentIdx] = useState(0)
	const [customAnswer, setCustomAnswer] = useState('')
	const [chatComplete, setChatComplete] = useState(false)

	const isInitialStatusFetched = useRef(false)
	const isInitialConversationFetched = useRef(false)
	const isInitialNewIdeasFetched = useRef(false)
	const isInitialSurveyFetched = useRef(false)
	const isInitialProfileFetched = useRef(false)
	const isOptionsFetched = useRef<Record<string, boolean>>({})

	const [writerProfileDataState, setWriterProfileDataState] =
		useState<TWriterProfileState>()

	const {
		storyIdeaDataState,
		setStoryIdeaDataState,
		selectedStoryIdeaState,
		setSelectedStoryIdeaState,
		isUpdateOutlinerStoryIdeaPending,
		savedStoryData,
		handleChangeStoryDataStateField,
	} = useNewIdeas()

	const { mutateAsync: sendChatMutateAsync, isPending: isChatLoading } =
		useOutlinerQuestionnaireChat()
	const { mutate: updateOutlinerQuestionnaireStatus } =
		useOutlinerQuestionnaireStatusMutation()
	const { mutateAsync: generateOptions, isPending: isOptionGenerationPending } =
		useOutlinerQuestionnaireSurveyGenerateOptionsMutation()
	const {
		mutateAsync: updateOutlinerQuestionnaireSurvey,
		isPending: updateOutlinerQuestionnaireSurveyPending,
	} = useOutlinerQuestionnaireSurveyQuestionsMutation()
	const {
		mutateAsync: updateOutlinerProfile,
		isPending: isUpdateOutlinerProfilePending,
	} = useOutlinerQuestionnaireProfileMutation()

	const {
		mutateAsync: sendNewIdeaRegenerate,
		isPending: isNewIdeaRegenerationPending,
	} = useOutlinerQuestionnaireNewIdeasRegenerationMutation()
	const [newIdeaRegenerationTaskId, setNewIdeaGenerationTaskId] = useState('')
	const [emptyNewIdeaGenerationTaskId, setEmptyNewIdeaGenerationTaskId] =
		useState('')
	const [completedTaskId, setCompletedTaskId] = useState({
		chat: '',
		newIdeas: '',
		newIdeasRegenerate: '',
	})
	const queryClient = useQueryClient()

	const writerDataMap = useMemo(() => {
		return getWriterProfileDataFromState(writerProfileDataState)
	}, [writerProfileDataState])

	const debouncedWritersProfile = useDebounce(writerDataMap)
	const savedWriterProfile = useRef<typeof debouncedWritersProfile>(null)

	const { initialStoryData } = useEpisodeTableContext()

	const {
		mutateAsync: completeOnboarding,
		isPending: isOnboardingCompletionPending,
	} = useCompleteOnboarding()

	const { responses, taskEnded } = useSocketStreaming()

	const isNewIdeaRegenerating = useMemo(() => {
		return newIdeaRegenerationTaskId && !taskEnded[newIdeaRegenerationTaskId]
	}, [newIdeaRegenerationTaskId, taskEnded])

	const isEmptyIdeaGenerating = useMemo(() => {
		return (
			emptyNewIdeaGenerationTaskId && !taskEnded[emptyNewIdeaGenerationTaskId]
		)
	}, [emptyNewIdeaGenerationTaskId, taskEnded])

	const currentQuestion = useMemo(() => {
		return questionsData?.questions?.[currentIdx]
	}, [currentIdx, questionsData])

	const isCustomAnswerSubmittable = useMemo(() => {
		return customAnswer.trim().length > 0
	}, [customAnswer])

	const chatCompleteRatio = useMemo(() => {
		const filteredMessages = messages.filter((item) => {
			return (
				item.role === EMessenger.ASSISTANT &&
				item.meta?.profileComplete?.completed_requirements_count
			)
		})
		const lastMessage = filteredMessages[filteredMessages.length - 1]
		if (!lastMessage || lastMessage.role !== EMessenger.ASSISTANT) {
			return 0
		}
		const complete =
			lastMessage.meta?.profileComplete?.completed_requirements_count ?? 0
		const pending =
			lastMessage.meta?.profileComplete?.pending_requirements_count ?? 10
		return complete / (pending + complete)
	}, [messages])

	const lastMessage = useMemo(() => {
		return messages[messages.length - 1]
	}, [messages])

	const lastMessageTaskId = useMemo(() => {
		return 'taskId' in lastMessage ? lastMessage.taskId : ''
	}, [lastMessage])

	const handleInitialStatusFetch = useCallback(
		(tab: EOutlinerQuestionnaireTab) => {
			if (isInitialStatusFetched.current) {
				return
			}
			setOutlinerQuestionnaireTab(tab)
			isInitialStatusFetched.current = true
		},
		[]
	)

	const handleInitialConversationFetch = useCallback(
		(data: TGetOutlinerQuestionnaireStatus) => {
			if (isInitialConversationFetched.current) {
				return
			}
			const chat = convertBEChatToFE(data)
			if (chat) {
				setMessages([INITIAL_CHAT_MESSAGE, ...chat])
			}
			isInitialConversationFetched.current = true
		},
		[]
	)

	const handleInitialProfileFetch = useCallback((data: TWriterProfileState) => {
		if (isInitialProfileFetched.current) {
			return
		}
		setWriterProfileDataState(data)
		savedWriterProfile.current = getWriterProfileDataFromState(data)
		isInitialProfileFetched.current = true
	}, [])

	const handleChangeTab = useCallback(
		(tab: EOutlinerQuestionnaireTab) => {
			const previousTab = outlinerQuestionnaireTab
			setOutlinerQuestionnaireTab(tab)
			updateOutlinerQuestionnaireStatus({ stage: tab })
			track({
				event: EVENT_TYPE.BUTTON_CLICK,
				screenName: SCREEN_NAME.PROJECTS,
				metaData: {
					action: ACTION.OUTLINER_ONBOARDING_STAGE_CHANGE,
					fromStage: previousTab,
					toStage: tab,
				},
			})
		},
		[updateOutlinerQuestionnaireStatus, outlinerQuestionnaireTab]
	)

	const handleStoryIdeaGenerate = useCallback(async () => {
		if (
			isWriterProfileLoaded(writerProfileDataState) &&
			!storyIdeaDataState?.length
		) {
			setStoryIdeaDataState([
				getStoryIdeaStateFromData({
					title: '',
					logline: '',
					synopsis: '',
					main_character: '',
					world: '',
					key_relationships: '',
					tone_and_style: '',
					narrative_journey: '',
					themes: '',
					why_this_fits: '',
				}),
			])
			return
		}
		const feData = getWriterProfileDataFromState(writerProfileDataState)
		const writer_profile = feData ? convertWritersProfileFeToBe(feData) : {}
		const taskId = await sendNewIdeaRegenerate({
			writer_profile,
			input_language: initialStoryData?.parent_language,
			previous_ideas: storyIdeaDataState
				.map(getStoryIdeaDataFromState)
				.filter((item): item is TStoryIdeaData => !!item),
		})

		// Track new ideas start (LLM task)
		track({
			event: EVENT_TYPE.BUTTON_CLICK,
			screenName: SCREEN_NAME.PROJECTS,
			metaData: {
				action: ACTION.OUTLINER_ONBOARDING_NEW_IDEAS_START,
				flowId: taskId,
				hasWriterProfile: Object.keys(writer_profile).length > 0,
			},
		})

		// Clear previous completed task ID when starting new generation
		setCompletedTaskId((prev) => ({
			...prev,
			newIdeas: '',
		}))

		setSelectedStoryIdeaState(0)
		setNewIdeaGenerationTaskId(taskId)
	}, [
		writerProfileDataState,
		sendNewIdeaRegenerate,
		storyIdeaDataState,
		initialStoryData,
		setSelectedStoryIdeaState,
		setStoryIdeaDataState,
	])

	const handleStoryIdeaRegenerateWithPrompt = useCallback(
		async (options: { file_urls?: string[]; prompt?: string }) => {
			const taskId = await sendNewIdeaRegenerate({
				writer_profile: {},
				input_language: initialStoryData?.parent_language,
				previous_ideas: storyIdeaDataState
					.map(getStoryIdeaDataFromState)
					.filter((item): item is TStoryIdeaData => !!item),
				...(options.prompt && { prompt: options.prompt }),
				...(options.file_urls && { file_urls: options.file_urls }),
			})

			// Track regenerate start (LLM task)
			track({
				event: EVENT_TYPE.BUTTON_CLICK,
				screenName: SCREEN_NAME.PROJECTS,
				metaData: {
					action: ACTION.OUTLINER_ONBOARDING_NEW_IDEAS_REGENERATE_START,
					flowId: taskId,
					hasPrompt: !!options.prompt,
					hasFileUrls: !!options.file_urls && options.file_urls.length > 0,
				},
			})

			// Clear previous completed task ID when starting new regeneration
			setCompletedTaskId((prev) => ({
				...prev,
				newIdeasRegenerate: '',
			}))

			setEmptyNewIdeaGenerationTaskId(taskId)
		},
		[sendNewIdeaRegenerate, storyIdeaDataState, initialStoryData]
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
			} else {
				void handleStoryIdeaGenerate()
			}
			isInitialNewIdeasFetched.current = true
		},
		[handleStoryIdeaGenerate, setStoryIdeaDataState, savedStoryData]
	)

	const handleInitialSurveyFetch = useCallback(
		(data: TGetOutlinerQuestionnaireSurveyResponse) => {
			if (isInitialSurveyFetched.current) {
				return
			}
			setQuestionsData(data.result)
			const answeredQuestions = Object.keys(data.result.responses).length
			if (data.result.stage === EOutlinerQuestionnaireTab.WRITER_PROFILE) {
				setOutlinerQuestionnaireTab(EOutlinerQuestionnaireTab.WRITER_PROFILE)
			} else {
				setCurrentIdx(
					answeredQuestions >= data.result.questions.length
						? data.result.questions.length - 1
						: answeredQuestions
				)
			}

			isInitialSurveyFetched.current = true
		},
		[]
	)

	const handleSendChat = useCallback(async () => {
		const userMessage = inputPrompt.trim()

		if (!userMessage) {
			return
		}

		setInputPrompt('')
		setMessages((prev) => [
			...prev,
			{ role: EMessenger.USER, content: userMessage },
		])

		const taskId = await sendChatMutateAsync({ message: userMessage })

		if (!taskId) {
			toast.error('Error sending message. Please try again.')
			setInputPrompt(userMessage)
			return
		}

		track({
			event: EVENT_TYPE.BUTTON_CLICK,
			screenName: SCREEN_NAME.PROJECTS,
			metaData: {
				action: ACTION.OUTLINER_ONBOARDING_CHAT_START,
				flowId: taskId,
				prompt: userMessage,
			},
		})

		// Clear previous completed task ID when starting new chat
		setCompletedTaskId((prev) => ({
			...prev,
			chat: '',
		}))

		setMessages((prev) => [
			...prev,
			{
				role: EMessenger.ASSISTANT,
				content: '',
				action: EAction.BLOCK,
				taskId: taskId,
			},
		])
	}, [inputPrompt, sendChatMutateAsync])

	const goToStart = useCallback(() => {
		setOutlinerQuestionnaireTab(EOutlinerQuestionnaireTab.START)
	}, [])

	const handleCompleteSurvey = useCallback(() => {
		setOutlinerQuestionnaireTab(EOutlinerQuestionnaireTab.WRITER_PROFILE)
		toast.success('Onboarding Survey Completed!')
	}, [])

	const handleNavigateQuestion = useCallback(
		(idx: number) => {
			if (
				questionsData?.questions?.length &&
				idx >= questionsData?.questions?.length
			) {
				handleCompleteSurvey()
				return
			}
			return setCurrentIdx(idx)
		},
		[handleCompleteSurvey, questionsData]
	)

	const handleChangeWriterProfileStateField = useCallback(
		({
			data,
			field,
		}: {
			data: Partial<TWriterProfileDataStateItem>
			field: TWriterProfileKey
		}) => {
			setWriterProfileDataState((prev) => {
				if (!prev) {
					return prev
				}
				return {
					...prev,
					[field]: {
						...prev[field],
						...data,
					},
				}
			})
		},
		[]
	)

	const handleOptionsGenerate = useCallback(
		async ({ question }: { question?: TOutlinerSurveyQuestion }) => {
			const dependsOnKey = question?.conditional?.depends_on
			const dependsOnAnswer = questionsData?.responses[dependsOnKey || '']

			if (!dependsOnKey || !dependsOnAnswer || !question) {
				return
			}

			if (isOptionsFetched.current[question.key]) {
				return
			}

			const options = await generateOptions({
				genre: dependsOnAnswer,
			})

			if (!options.shows) {
				return
			}

			// Track options generation (LLM task)
			const flowId = `options_${Date.now()}`
			track({
				event: EVENT_TYPE.BUTTON_CLICK,
				screenName: SCREEN_NAME.PROJECTS,
				metaData: {
					action: ACTION.OUTLINER_ONBOARDING_SURVEY_OPTIONS_GENERATE,
					flowId,
					genre: dependsOnAnswer,
				},
			})

			setQuestionsData((prev) => {
				if (!prev) {
					return prev
				}
				return {
					...prev,
					questions: prev.questions.map((ques) => {
						if (ques.key !== dependsOnKey) {
							return ques
						}
						return {
							...ques,
							options: [
								{
									key: dependsOnAnswer,
									text: dependsOnAnswer,
									dependents: {
										[question.key]: options?.shows.map((show) => {
											return {
												key: show,
												text: show,
											}
										}),
									},
								},
								...ques.options,
							],
						}
					}),
				}
			})

			isOptionsFetched.current[question.key] = true
		},
		[questionsData, generateOptions]
	)

	const handleCompleteOnboarding = useCallback(async () => {
		const idea = storyIdeaDataState[selectedStoryIdeaState]
		const ideaData = getStoryIdeaDataFromState(idea)
		if (!ideaData || !initialStoryData?.id) {
			return
		}

		await completeOnboarding({
			id: initialStoryData?.id,
			selectedIdea: ideaData,
			title: idea.title.value,
		})

		// Track onboarding completion
		track({
			event: EVENT_TYPE.BUTTON_CLICK,
			screenName: SCREEN_NAME.PROJECTS,
			metaData: {
				action: ACTION.OUTLINER_ONBOARDING_COMPLETE,
				selectedIdeaTitle: idea.title.value,
			},
		})

		handleChangeTab(EOutlinerQuestionnaireTab.COMPLETED)
	}, [
		selectedStoryIdeaState,
		storyIdeaDataState,
		completeOnboarding,
		handleChangeTab,
		initialStoryData,
	])

	const handleAnswerSelect = useCallback(
		async (answer: string, idx: number, isCustom?: boolean) => {
			if (!questionsData?.questions[idx].key) {
				return
			}
			setCustomAnswer('')

			const questionKey = questionsData.questions[idx].key
			const isGenre = questionKey === 'genre'

			// Track survey answer
			track({
				event: EVENT_TYPE.BUTTON_CLICK,
				screenName: SCREEN_NAME.PROJECTS,
				metaData: {
					action: ACTION.OUTLINER_ONBOARDING_SURVEY_ANSWER,
					questionKey,
					answer: isCustom ? 'custom' : answer,
					isCustom: !!isCustom,
				},
			})

			const getOptionsPromise =
				isGenre && isCustom
					? generateOptions({ genre: answer })
					: Promise.resolve(null)

			const updateDataPromise = updateOutlinerQuestionnaireSurvey({
				answer: isCustom ? 'custom' : answer,
				custom_text: isCustom ? answer : '',
				question_key: questionKey,
			})

			const [generateOptionsData, updateDataResp] = await Promise.all([
				getOptionsPromise,
				updateDataPromise,
			])

			setQuestionsData((prev) => {
				if (!prev || !prev.questions[idx]) {
					return prev
				}
				return {
					...prev,
					questions: !generateOptionsData?.shows
						? prev.questions
						: prev.questions.map((ques) => {
								if (ques.key !== 'genre') {
									return ques
								}
								return {
									...ques,
									options: [
										...ques.options,
										{
											key: answer,
											text: answer,
											dependents: {
												show_style: generateOptionsData?.shows.map((show) => {
													return {
														key: show,
														text: show,
													}
												}),
											},
										},
									],
								}
							}),
					responses: {
						...prev.responses,
						[prev.questions[idx].key]: answer,
					},
				}
			})
			if (
				updateDataResp?.result.stage ===
				EOutlinerQuestionnaireTab.WRITER_PROFILE
			) {
				setOutlinerQuestionnaireTab(EOutlinerQuestionnaireTab.WRITER_PROFILE)
			} else {
				handleNavigateQuestion(idx + 1)
			}
		},
		[
			handleNavigateQuestion,
			questionsData,
			updateOutlinerQuestionnaireSurvey,
			generateOptions,
		]
	)

	useEffect(() => {
		if (
			!debouncedWritersProfile ||
			isEqual(savedWriterProfile.current, debouncedWritersProfile)
		) {
			return
		}
		const profile = convertWritersProfileFeToBe(debouncedWritersProfile)
		void updateOutlinerProfile({
			profile,
		})

		// Track profile update
		track({
			event: EVENT_TYPE.BUTTON_CLICK,
			screenName: SCREEN_NAME.PROJECTS,
			metaData: {
				action: ACTION.OUTLINER_ONBOARDING_PROFILE_UPDATE,
			},
		})

		savedWriterProfile.current = debouncedWritersProfile
	}, [debouncedWritersProfile, updateOutlinerProfile])

	useEffect(() => {
		if (!newIdeaRegenerationTaskId || !responses[newIdeaRegenerationTaskId]) {
			return
		}
		const responseStr = responses[newIdeaRegenerationTaskId].join('')
		const parsed = parseOptimistically(responseStr) as TStoryIdeaData[]

		if (parsed) {
			const storyDataState = parsed.map(getStoryIdeaStateFromData)
			setStoryIdeaDataState(storyDataState)
		}

		if (taskEnded[newIdeaRegenerationTaskId]) {
			// Track new ideas end (LLM task)
			const responseStr = responses[newIdeaRegenerationTaskId].join('')
			track({
				event: EVENT_TYPE.BUTTON_CLICK,
				screenName: SCREEN_NAME.PROJECTS,
				metaData: {
					action: ACTION.OUTLINER_ONBOARDING_NEW_IDEAS_END,
					flowId: newIdeaRegenerationTaskId,
					response: responseStr,
				},
			})

			// Set completed task ID for feedback
			setCompletedTaskId((prev) => ({
				...prev,
				newIdeas: newIdeaRegenerationTaskId,
			}))

			setNewIdeaGenerationTaskId('')
			setStoryIdeaDataState((prev) => {
				return [...prev, getStoryIdeaStateFromData(EMPTY_STORY_DATA)]
			})
			toast.success('New Story Idea Generated!')
		}
	}, [newIdeaRegenerationTaskId, responses, taskEnded, setStoryIdeaDataState])

	useEffect(() => {
		if (
			!emptyNewIdeaGenerationTaskId ||
			!responses[emptyNewIdeaGenerationTaskId]
		) {
			return
		}
		const responseStr = responses[emptyNewIdeaGenerationTaskId].join('')
		const parsed = parseOptimistically(responseStr) as {
			story_idea: TStoryIdeaData
			writer_profile: TWriterProfileDataBE
		}

		if (parsed?.story_idea) {
			const storyDataState = getStoryIdeaStateFromData(parsed.story_idea)
			setStoryIdeaDataState((prev) => {
				if (prev.length === 0) {
					return [storyDataState]
				}
				const updated = [...prev]
				updated[updated.length - 1] = storyDataState
				return updated
			})
		}
		if (parsed?.writer_profile) {
			const profileData = convertWritersProfileBeToFe(parsed.writer_profile)
			const profileState = getWriterProfileStateFromData(profileData)
			setWriterProfileDataState(profileState)
			savedWriterProfile.current = profileData
		}

		if (taskEnded[emptyNewIdeaGenerationTaskId]) {
			// Track regenerate end (LLM task)
			const regenerateResponseStr =
				responses[emptyNewIdeaGenerationTaskId].join('')
			track({
				event: EVENT_TYPE.BUTTON_CLICK,
				screenName: SCREEN_NAME.PROJECTS,
				metaData: {
					action: ACTION.OUTLINER_ONBOARDING_NEW_IDEAS_REGENERATE_END,
					flowId: emptyNewIdeaGenerationTaskId,
					response: regenerateResponseStr,
				},
			})

			// Set completed task ID for feedback
			setCompletedTaskId((prev) => ({
				...prev,
				newIdeasRegenerate: emptyNewIdeaGenerationTaskId,
			}))

			setEmptyNewIdeaGenerationTaskId('')
			toast.success('Story Idea Regenerated!')
			void queryClient.refetchQueries({
				queryKey: [OUTLINER_QUESTIONNAIRE_PROFILE_QUERY_KEY],
			})
		}
	}, [
		emptyNewIdeaGenerationTaskId,
		responses,
		taskEnded,
		setStoryIdeaDataState,
		queryClient,
	])

	useEffect(() => {
		if (
			!lastMessageTaskId ||
			!responses[lastMessageTaskId] ||
			!taskEnded[lastMessageTaskId]
		) {
			return
		}
		try {
			const response = responses[lastMessageTaskId]
			const parsed = response.map(
				parseOptimistically
			) as TPostOutlinerQuestionnaireChatResponse[]
			const derivedMessage = getDerivedChatMessage(parsed)
			if (!derivedMessage) {
				return
			}
			setMessages((prev) => {
				const updated = updateLast(prev, (msg: TMessage) => {
					if (!('taskId' in msg) || msg.taskId !== lastMessageTaskId) {
						return msg
					}
					return {
						...msg,
						content: derivedMessage.message,
						taskId: lastMessageTaskId, // Keep taskId for feedback tracking
						meta: {
							profileComplete: {
								completed_requirements_count:
									derivedMessage.completed_requirements_count,
								pending_requirements_count:
									derivedMessage.pending_requirements_count,
							},
						},
					} as TMessage
				})
				return [...updated]
			})

			if (derivedMessage.stage === EOutlinerQuestionnaireTab.WRITER_PROFILE) {
				setChatComplete(true)
			}

			// Track chat end event
			const userMessageIndex = messages.length - 2
			const userMessage =
				userMessageIndex >= 0 &&
				messages[userMessageIndex]?.role === EMessenger.USER
					? messages[userMessageIndex].content
					: ''
			track({
				event: EVENT_TYPE.BUTTON_CLICK,
				screenName: SCREEN_NAME.PROJECTS,
				metaData: {
					action: ACTION.OUTLINER_ONBOARDING_CHAT_END,
					flowId: lastMessageTaskId,
					prompt: userMessage,
					response: derivedMessage.message,
				},
			})

			// Set completed task ID for feedback
			setCompletedTaskId((prev) => ({
				...prev,
				chat: lastMessageTaskId,
			}))
		} catch (error) {
			console.info(error)
			return
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [lastMessageTaskId, taskEnded, responses])

	const handleChatFeedback = useCallback(
		(taskId: string, feedback: EFeedback, comment?: string) => {
			track({
				event: EVENT_TYPE.BUTTON_CLICK,
				screenName: SCREEN_NAME.PROJECTS,
				metaData: {
					action: ACTION.OUTLINER_ONBOARDING_CHAT_USER_FEEDBACK,
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
				screenName: SCREEN_NAME.PROJECTS,
				metaData: {
					action: ACTION.OUTLINER_ONBOARDING_NEW_IDEAS_USER_FEEDBACK,
					flowId: completedTaskId.newIdeas,
					feedback,
					comment,
				},
			})
		},
		[completedTaskId.newIdeas]
	)

	const handleNewIdeasRegenerateFeedback = useCallback(
		(feedback: EFeedback, comment?: string) => {
			if (!completedTaskId.newIdeasRegenerate) {
				return
			}
			track({
				event: EVENT_TYPE.BUTTON_CLICK,
				screenName: SCREEN_NAME.PROJECTS,
				metaData: {
					action: ACTION.OUTLINER_ONBOARDING_NEW_IDEAS_REGENERATE_USER_FEEDBACK,
					flowId: completedTaskId.newIdeasRegenerate,
					feedback,
					comment,
				},
			})
		},
		[completedTaskId.newIdeasRegenerate]
	)

	const handleProfileFeedback = useCallback(
		(feedback: EFeedback, comment?: string) => {
			track({
				event: EVENT_TYPE.BUTTON_CLICK,
				screenName: SCREEN_NAME.PROJECTS,
				metaData: {
					action: ACTION.OUTLINER_ONBOARDING_PROFILE_USER_FEEDBACK,
					feedback,
					comment,
				},
			})
		},
		[]
	)

	return {
		outlinerQuestionnaireTab,
		setOutlinerQuestionnaireTab,
		messages,
		setMessages,
		isChatLoading,
		inputPrompt,
		setInputPrompt,
		handleSendChat,
		goToStart,
		currentIdx,
		handleNavigateQuestion,
		questionsData,
		setQuestionsData,
		handleAnswerSelect,
		customAnswer,
		setCustomAnswer,
		currentQuestion,
		isCustomAnswerSubmittable,
		storyIdeaDataState,
		setStoryIdeaDataState,
		handleChangeStoryDataStateField,
		handleChangeWriterProfileStateField,
		writerProfileDataState,
		selectedStoryIdeaState,
		setSelectedStoryIdeaState,
		handleInitialNewIdeasFetch,
		handleChangeTab,
		handleInitialStatusFetch,
		chatComplete,
		updateOutlinerQuestionnaireSurveyPending:
			updateOutlinerQuestionnaireSurveyPending || isOptionGenerationPending,
		isOptionGenerationPending,
		handleInitialSurveyFetch,
		handleOptionsGenerate,
		handleInitialProfileFetch,
		isUpdateOutlinerProfilePending,
		handleStoryIdeaGenerate,
		handleStoryIdeaRegenerateWithPrompt,
		isNewIdeaRegenerating:
			isNewIdeaRegenerationPending ||
			!!isNewIdeaRegenerating ||
			!!isEmptyIdeaGenerating,
		isUpdateOutlinerStoryIdeaPending,
		isOnboardingCompletionPending,
		handleCompleteOnboarding,
		handleInitialConversationFetch,
		chatCompleteRatio,
		lastMessageTaskId,
		completedTaskId,
		handleChatFeedback,
		handleNewIdeasFeedback,
		handleNewIdeasRegenerateFeedback,
		handleProfileFeedback,
	}
}

type TOutlinerQuestionnaireContext = ReturnType<
	typeof useOutlinerQuestionnaireUtil
>

const OutlinerQuestionnaireContext =
	createContext<TOutlinerQuestionnaireContext | null>(null)

function OutlinerQuestionnaireUtilContextProvider({
	children,
}: React.PropsWithChildren) {
	const value = useOutlinerQuestionnaireUtil()
	return (
		<OutlinerQuestionnaireContext.Provider value={value}>
			{children}
		</OutlinerQuestionnaireContext.Provider>
	)
}

export function OutlinerQuestionnaireContextProvider({
	children,
}: React.PropsWithChildren) {
	return (
		<OutlinerQuestionnaireUtilContextProvider>
			{children}
		</OutlinerQuestionnaireUtilContextProvider>
	)
}
export default function useOutlinerQuestionnaire() {
	const context = useContext(OutlinerQuestionnaireContext)

	if (!context) {
		throw new Error(
			'useOutlinerQuestionnaire must be used inside OutlinerQuestionnaireContextProvider!'
		)
	}
	return context
}

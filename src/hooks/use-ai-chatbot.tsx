/* eslint-disable react-hooks/exhaustive-deps */
import React, {
	createContext,
	RefObject,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useRef,
	useState,
} from 'react'
import { AI_USER_ID } from '@/constants/ai-constants'
import useAIChatbotHook from '@/hooks/mutation/use-aichatbot-hook'
import useCountdownTimer from '@/hooks/use-countdown-timer'
import useSocketStreaming from '@/hooks/use-socket-streaming'
import { useThrottle } from '@/hooks/use-throttle'
import ReviewAdded from '@/page-builders/plate-editor/sidebar-sections/ai-chatbot/messages/review-added'
import useAIStore from '@/store/ai-store'
import useEpisodeIdStore from '@/store/episode-id-store'
import usePlateStore from '@/store/plate-store'
import { parse } from 'best-effort-json-parser'
import { jsonrepair } from 'jsonrepair'
import { nanoid } from 'nanoid'
import { Value } from 'platejs'
import {
	ParagraphPlugin,
	useEditorPlugin,
	useEditorRef,
	useEditorState,
} from 'platejs/react'

import {
	discussionPlugin,
	TDiscussion,
} from '@/components/editor/plugins/discussion-kit'
import useEpisodeTableContext from '@/providers/episode-table-provider'
import { addSFX, convertReviewResponse, minify } from '@/lib/utils/ai-chatbot'
import { parseOptimistically } from '@/lib/utils/helpers'
import { breakDownValue, getText } from '@/lib/utils/plate'

import {
	EAction,
	EChatMode,
	EMessenger,
	TStoryChatSuggestion,
} from '@/types/ai-types'
import {
	IndexedCommentsResponse,
	IndexedSFXResponse,
} from '@/types/editor-types'
import { EDualVIewMode, TGetEpisodeResponse } from '@/types/episode-type'
import { ESidebar } from '@/types/plate-types'

type TChatbotContext = {
	cancelRequest: () => void
	changesPending: Value | null
	clearMessages: () => void
	disabled: boolean
	getProgress: (taskId?: string) => number
	getTimeLeft: (taskId?: string) => number
	handleKeyDown: (e: React.KeyboardEvent) => void
	handleSendMessage: (e: React.FormEvent) => void
	handleSuggestion: (suggestion: TStoryChatSuggestion) => void
	input: string
	isFocused: boolean
	isPending: boolean
	isTaskRunning: (taskId: string) => boolean
	removeReview: () => void
	setInput: React.Dispatch<React.SetStateAction<string>>
	setIsFocused: React.Dispatch<React.SetStateAction<boolean>>
	textContainerRef: React.RefObject<HTMLDivElement>
	textareaRef: React.RefObject<HTMLTextAreaElement>
}

const ChatbotContext = createContext<TChatbotContext>({
	cancelRequest: () => {},
	changesPending: null,
	clearMessages: () => {},
	disabled: false,
	handleKeyDown: () => {},
	handleSendMessage: () => {},
	handleSuggestion: () => {},
	input: '',
	setInput: () => {},
	isPending: false,
	removeReview: () => {},
	isFocused: false,
	setIsFocused: () => {},
	textContainerRef: null as unknown as RefObject<HTMLDivElement>,
	textareaRef: null as unknown as RefObject<HTMLTextAreaElement>,
	getTimeLeft: () => 0,
	getProgress: () => 0,
	isTaskRunning: () => false,
})

export function ChatbotProvider({
	children: consumer,
	episodeContent,
}: {
	children: React.ReactNode
	episodeContent: TGetEpisodeResponse | null | undefined
}) {
	const [input, setInput] = useState('')
	const [sfxStreaming, setSfxStreaming] = useState<string>('')
	const [reviewStreaming, setReviewStreaming] = useState<string>('')
	const [originalChildren, setOriginalChildren] = useState<Value>()
	const [blockStreaming, setBlockStreaming] = useState<string>('')
	const [isFocused, setIsFocused] = useState<boolean>(false)
	const textContainerRef = useRef<HTMLDivElement>(null)
	const textareaRef = useRef<HTMLTextAreaElement>(null)

	const {
		store,
		addMessages,
		clearMessages,
		popMessage,
		setPrevValue,
		setResponseValue,
		setRequestedAction,
		updateMessages,
	} = useAIStore()

	const { setSidebar, setDisableDiffAcceptReject } = usePlateStore()
	const {
		setDualViewMode,
		setAcceptedDiffValue,
		store: useEpisodeIdContext,
	} = useEpisodeIdStore()
	const { messages } = store()
	const requestedAction = store((state) => state.requestedAction)
	const value = useEpisodeIdContext((state) => state.acceptedDiffValue)
	const prevValue = store((state) => state.prevValue)

	const { responses, taskEnded, stopTask } = useSocketStreaming()
	const { initialStoryData } = useEpisodeTableContext()

	const {
		start: startCountdown,
		stop: stopCountdown,
		reset: resetCountdown,
		getTimeLeft,
		getProgress,
		isTaskRunning,
	} = useCountdownTimer()

	const countdownStoppedRef = useRef<Set<string>>(new Set())

	const stopCountdownOnResponse = useCallback(
		(taskId: string) => {
			if (!countdownStoppedRef.current.has(taskId)) {
				stopCountdown(taskId)
				countdownStoppedRef.current.add(taskId)
			}
		},
		[stopCountdown]
	)

	const editor = useEditorRef()
	const { children } = useEditorState()
	const { setOptions: setDiscussionOptions, getOption: getDiscussionOption } =
		useEditorPlugin(discussionPlugin)

	const changesPending = prevValue && value

	const episodesCount = useMemo(() => {
		return initialStoryData?.episode_count || 0
	}, [initialStoryData])

	const { aiChatbotMutation } = useAIChatbotHook({
		episodeNumber: episodeContent?.chapter.seq_number || 0,
		episodesCount,
	})

	const { data: aiResponse, isPending, reset } = aiChatbotMutation

	const staleReviewIDRef = useRef<string[] | null>(null)
	const commentsCount = useRef<number>(0)

	const throttledResponse = useThrottle(responses[sfxStreaming], 1000)

	const handleSendMessage = (e: React.FormEvent) => {
		e.preventDefault()
		if (!input.trim()) {
			return
		}
		aiChatbotMutation.mutate({
			aiChatbotData: {
				messages: messages.map((message) => ({
					content: message.content || '',
					role: message.role,
				})),
				user_message: input,
				ep_number: episodeContent?.chapter.seq_number?.toString(),
				ep_text: getText(children),
				context: episodeContent?.chapter?.props?.llm_memories?.context || '',
			},
		})
		addMessages({ role: EMessenger.USER, content: input })
		setInput('')
		setRequestedAction(EChatMode.BLOCK)
	}

	const addComment = (
		value: TDiscussion | null | undefined
	): TDiscussion | undefined => {
		if (!value?.userId) {
			return
		}

		setDiscussionOptions((draft) => {
			draft.discussions ??= []
			draft.discussions.push(value)
		})

		return value
	}

	const handleSuggestion = (suggestion: TStoryChatSuggestion) => {
		if (suggestion.action === EChatMode.LOCALIZE) {
			setSidebar(ESidebar.FAR)
			return
		}
		if (suggestion.action === EChatMode.VOICE2_XML) {
			setDualViewMode(EDualVIewMode.VOICE_PASS)
			setSidebar(ESidebar.DUAL_VIEW)
			addMessages({
				taskId: nanoid(),
				content: 'Voice Pass Started',
				role: EMessenger.ASSISTANT,
				action: EAction.VOICE2_XML,
			})
			return
		}
		if (suggestion.action === EChatMode.PROMPTS) {
			setInput(suggestion.value)
			setIsFocused(true)
			setTimeout(() => textareaRef.current?.focus(), 0)
			return
		}
		addMessages({ role: EMessenger.USER, content: suggestion.value })
		aiChatbotMutation.mutate({
			aiChatbotData: {
				messages: messages.map((message) => ({
					content: message.content || '',
					role: message.role,
				})),
				user_message: suggestion.value,
				ep_number: episodeContent?.chapter.seq_number?.toString(),
				ep_text: episodeContent?.text as string,
				ep_text_json: minify(children),
				chat_mode: suggestion.action,
			},
		})
		setRequestedAction(suggestion.action)
	}

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault()
			handleSendMessage(e)
		}
	}

	const handleBlock = ({ text, taskId }: { taskId: string; text: string }) => {
		addMessages({
			role: EMessenger.ASSISTANT,
			content: text,
			action: EAction.BLOCK,
			taskId,
		})
		setBlockStreaming(taskId)
	}

	function cancelRequest() {
		popMessage()
		reset()
		setResponseValue(null)
		setAcceptedDiffValue(null)
		removeReview()
		setSfxStreaming('')
		setReviewStreaming('')
		setBlockStreaming('')
		resetCountdown()
		countdownStoppedRef.current.clear()
		if (aiChatbotMutation.data) {
			stopTask(aiChatbotMutation.data)
		}
	}

	function addReview(reviewResponse: IndexedCommentsResponse[]) {
		const children = originalChildren
		if (!children) {
			return
		}
		const resp = convertReviewResponse(reviewResponse, children)
		if (!resp.comments.length) {
			return
		}
		resp.comments.forEach((comment) => {
			if (!comment?.id || !comment?.text) {
				return
			}
			addComment({
				id: comment.id,
				userId: AI_USER_ID,
				createdAt: new Date(),
				isResolved: false,
				documentContent: comment.nodeText,
				comments: [
					{
						id: nanoid(),
						userId: AI_USER_ID,
						createdAt: new Date(),
						isEdited: false,
						discussionId: comment.id,
						contentRich: [
							{
								id: nanoid(),
								type: ParagraphPlugin.key,
								children: [
									{
										text: comment.text
											.trim()
											.replace(/•/g, '-')
											.replace(/(?<=\s)-/g, '\n-')
											.replace('</comment_format> <comment_format>', ''),
									},
								],
							},
						],
					},
				],
			})
		})
		staleReviewIDRef.current = resp.comments.map((comment) => comment.id)
		commentsCount.current = resp.comments.length
		editor.tf.setValue(breakDownValue(resp.value))
	}

	function removeStaleReviews(staleReviewIDs: string[]) {
		if (!staleReviewIDs || staleReviewIDs.length === 0) {
			return
		}
		const currentDiscussions = getDiscussionOption('discussions')
		const updatedDiscussions = currentDiscussions.filter(
			(discussion) => !staleReviewIDs.includes(discussion.id)
		)
		setDiscussionOptions((draft) => {
			draft.discussions = updatedDiscussions
		})
	}

	function removeReview() {
		staleReviewIDRef.current = null
		if (!reviewStreaming || !responses[reviewStreaming]) {
			return
		}
		const reviewResponse = parse(
			jsonrepair(responses[reviewStreaming].join(''))
		) as IndexedCommentsResponse[]
		const children = originalChildren
		if (!children) {
			return
		}
		const resp = convertReviewResponse(reviewResponse, children)
		resp.comments.forEach((comment) => {
			const updatedDiscussions = editor
				.getOption(discussionPlugin, 'discussions')
				.filter((discussion) => discussion.id !== comment.id)
			editor.setOption(discussionPlugin, 'discussions', updatedDiscussions)
		})
		editor.tf.setValue(breakDownValue(children))
	}

	useEffect(() => {
		if (!isPending && aiResponse) {
			startCountdown(aiResponse)
			countdownStoppedRef.current.delete(aiResponse)

			if (requestedAction === EChatMode.REVIEW) {
				setOriginalChildren(children)
				setReviewStreaming(aiResponse)
				addMessages({
					taskId: aiResponse,
					role: EMessenger.ASSISTANT,
					action: EAction.REVIEW,
					content: 'Reviewing your content',
				})
			} else if (requestedAction === EChatMode.SFX) {
				setOriginalChildren(children)
				setSfxStreaming(aiResponse)
				addMessages({
					taskId: aiResponse,
					role: EMessenger.ASSISTANT,
					action: EAction.CHANGES,
					content: 'Inserting SFX to your content',
				})
			} else if (requestedAction === EChatMode.VOICE2_XML) {
				setOriginalChildren(children)
				addMessages({
					taskId: aiResponse,
					role: EMessenger.ASSISTANT,
					action: EAction.VOICE,
					content: 'Voice Parsing',
				})
			} else {
				handleBlock({ text: '', taskId: aiResponse })
			}
			setRequestedAction(null)
		}
	}, [aiResponse, isPending])

	useEffect(() => {
		if (!sfxStreaming || !originalChildren) {
			return
		}
		if (taskEnded[sfxStreaming]) {
			setSfxStreaming('')
			setDisableDiffAcceptReject(false)
			setOriginalChildren(undefined)
			return
		}
		if (!throttledResponse) {
			return
		}

		stopCountdownOnResponse(sfxStreaming)

		try {
			let parsedResponse = parseOptimistically<IndexedSFXResponse>(
				throttledResponse.join('')
			)
			if (!parsedResponse) {
				return
			}
			parsedResponse = parsedResponse
				.filter((item) => {
					const keys = Object.keys(item)
					return keys.includes('match_string') &&
						keys.includes('sfx') &&
						keys.includes('id')
						? item
						: null
				})
				.filter(Boolean)

			if (!parsedResponse.length) {
				return
			}

			const responseValue = addSFX(
				parsedResponse,
				originalChildren,
				ParagraphPlugin.key
			)

			setResponseValue(structuredClone(responseValue))
			setPrevValue(structuredClone(children))
			setDisableDiffAcceptReject(true)
		} catch (error) {
			console.log(error)
		}
	}, [
		sfxStreaming,
		throttledResponse,
		taskEnded[sfxStreaming],
		originalChildren,
	])

	useEffect(() => {
		if (!reviewStreaming || !originalChildren) {
			return
		}
		if (taskEnded[reviewStreaming]) {
			setReviewStreaming('')
			updateMessages(
				{
					role: EMessenger.ASSISTANT,
					action: EAction.REVIEW,
					content: 'Completed',
					taskId: reviewStreaming,
					component: <ReviewAdded count={commentsCount.current} />,
				},
				messages.length - 1
			)
			setOriginalChildren(undefined)
			staleReviewIDRef.current = null
			return
		}
		if (!responses[reviewStreaming]) {
			return
		}

		stopCountdownOnResponse(reviewStreaming)

		try {
			const parsedResponse =
				parseOptimistically<IndexedCommentsResponse[]>(
					responses[reviewStreaming].join('')
				) ??
				(responses[reviewStreaming]
					.map((res) => parseOptimistically<IndexedCommentsResponse>(res))
					.filter(Boolean) as IndexedCommentsResponse[])

			if (!parsedResponse || !parsedResponse.length) {
				return
			}
			if (staleReviewIDRef.current && staleReviewIDRef.current.length > 0) {
				removeStaleReviews(staleReviewIDRef.current)
			}
			addReview(parsedResponse)
		} catch (error) {
			console.error(error)
		}
	}, [
		reviewStreaming,
		responses[reviewStreaming],
		taskEnded[reviewStreaming],
		originalChildren,
	])

	useEffect(() => {
		if (!blockStreaming) {
			return
		}
		if (taskEnded[blockStreaming]) {
			setBlockStreaming('')
			const lastIndex = messages.length - 1
			if (lastIndex >= 0) {
				updateMessages(
					{
						...messages[lastIndex],
						content:
							responses[blockStreaming]?.join('') ||
							"Sorry, I don't have an answer to that at the moment.",
					},
					lastIndex
				)
			}
			return
		}

		if (responses[blockStreaming] && responses[blockStreaming].length > 0) {
			stopCountdownOnResponse(blockStreaming)
		}
	}, [blockStreaming, taskEnded[blockStreaming], responses[blockStreaming]])

	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (
				textContainerRef.current &&
				!textContainerRef.current.contains(event.target as Node)
			) {
				setIsFocused(false)
			}
		}

		document.addEventListener('mousedown', handleClickOutside)
		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [setIsFocused])

	const lastMessage = useMemo(() => messages[messages.length - 1], [messages])
	const disabled = !!(
		changesPending ||
		isPending ||
		(sfxStreaming && !taskEnded[sfxStreaming]) ||
		(reviewStreaming && !taskEnded[reviewStreaming]) ||
		(lastMessage &&
			lastMessage.role === EMessenger.ASSISTANT &&
			lastMessage.action === EAction.BLOCK &&
			lastMessage.taskId &&
			!taskEnded[lastMessage.taskId])
	)

	const context = {
		disabled,
		removeReview,
		handleKeyDown,
		handleSuggestion,
		isPending,
		changesPending,
		handleSendMessage,
		input,
		setInput,
		isFocused,
		setIsFocused,
		cancelRequest,
		clearMessages,
		textContainerRef,
		textareaRef,
		getTimeLeft,
		getProgress,
		isTaskRunning,
	}

	return (
		<ChatbotContext.Provider value={context}>
			{consumer}
		</ChatbotContext.Provider>
	)
}

export default function useAIChatbot() {
	const context = useContext(ChatbotContext)
	if (!context) {
		throw new Error('useAIChatbot must be used within ChatbotProvider')
	}
	return context
}

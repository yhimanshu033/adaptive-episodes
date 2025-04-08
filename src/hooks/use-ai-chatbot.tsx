/* eslint-disable react-hooks/exhaustive-deps */
import React, {
	createContext,
	useContext,
	useEffect,
	useMemo,
	useState,
} from 'react'
import { useParams } from 'next/navigation'
import { AI_USER_ID } from '@/constants/ai-constants'
import useAIChatbotHook from '@/hooks/mutation/use-aichatbot-hook'
import useEpisodeContent from '@/hooks/query/use-episode-content'
import { useStoriesData } from '@/hooks/query/use-story-data'
import useSocketStreaming from '@/hooks/use-socket-streaming'
import useAIStore from '@/store/ai-store'
import useEpisodeIdStore from '@/store/episode-id-store'
import usePlateStore from '@/store/plate-store'
import { TComment } from '@udecode/plate-comments'
import { CommentsPlugin } from '@udecode/plate-comments/react'
import {
	ParagraphPlugin,
	useEditorPlugin,
	useEditorRef,
	useEditorState,
} from '@udecode/plate-common/react'
import { Value } from '@udecode/slate'
import { WithPartial } from '@udecode/utils'
import { parse } from 'best-effort-json-parser'
import { jsonrepair } from 'jsonrepair'
import { nanoid } from 'nanoid'

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
import { EDualVIewMode } from '@/types/episode-type'
import { ESidebar } from '@/types/plate-types'

type TChatbotContext = {
	cancelRequest: () => void
	changesPending: Value | null
	clearMessages: () => void
	disabled: boolean
	handleKeyDown: (e: React.KeyboardEvent) => void
	handleSendMessage: (e: React.FormEvent) => void
	handleSuggestion: (suggestion: TStoryChatSuggestion) => void
	input: string
	isPending: boolean
	removeReview: () => void
	setInput: React.Dispatch<React.SetStateAction<string>>
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
})

export function ChatbotProvider({
	children: consumer,
}: {
	children: React.ReactNode
}) {
	const [input, setInput] = useState('')
	const [sfxStreaming, setSfxStreaming] = useState<string>('')
	const [reviewStreaming, setReviewStreaming] = useState<string>('')
	const [originalChildren, setOriginalChildren] = useState<Value>()
	const [blockStreaming, setBlockStreaming] = useState<string>('')

	const { id } = useParams()
	const {
		store,
		addMessages,
		clearMessages,
		popMessage,
		setAcceptedValue,
		setPrevValue,
		setResponseValue,
		setRequestedAction,
		updateMessages,
	} = useAIStore()

	const { setSidebar } = usePlateStore()
	const { setDualViewMode } = useEpisodeIdStore()
	const { messages } = store()
	const requestedAction = store((state) => state.requestedAction)
	const value = store((state) => state.acceptedValue)
	const prevValue = store((state) => state.prevValue)

	const { responses, taskEnded } = useSocketStreaming()

	const { data: episodeContent } = useEpisodeContent()
	const { data: stories } = useStoriesData()

	const editor = useEditorRef()
	const { children } = useEditorState()
	const { api, setOptions } = useEditorPlugin(CommentsPlugin)

	const changesPending = prevValue && value

	const episodesCount = useMemo(() => {
		return stories?.find((data) => data?.id === Number(id))?.episode_count || 0
	}, [stories, id])

	const { aiChatbotMutation } = useAIChatbotHook({
		episodeNumber: episodeContent?.chapter.seq_number || 0,
		episodesCount,
	})

	const { data: aiResponse, isPending, reset } = aiChatbotMutation

	const handleSendMessage = (e: React.FormEvent) => {
		e.preventDefault()
		if (!input.trim()) return
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

	const addComment = (value: TComment) => {
		const id = value.id ?? nanoid()
		if (!value) return
		const newComment: WithPartial<TComment, 'userId'> = {
			...value,
		}

		if (newComment?.userId) {
			setOptions((draft) => {
				if (!draft.comments) {
					draft.comments = {}
				}
				draft.comments[id] = newComment as TComment
			})
		}

		return newComment
	}

	const handleSuggestion = (suggestion: TStoryChatSuggestion) => {
		if (suggestion.action === EChatMode.LOCALIZE) {
			setSidebar(ESidebar.FAR)
			return
		}
		if (suggestion.action === EChatMode.VOICE2_XML) {
			setDualViewMode(EDualVIewMode.VOICE_PASS)
			setSidebar(ESidebar.DUAL_VIEW)
			return
		}
		if (suggestion.action === EChatMode.PROMPTS) {
			setInput(suggestion.value)
			return
		}
		addMessages({ role: EMessenger.USER, content: suggestion.value })
		aiChatbotMutation.mutate({
			aiChatbotData: {
				messages,
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
		setAcceptedValue(null)
		removeReview()
		setSfxStreaming('')
		setReviewStreaming('')
		setBlockStreaming('')
	}
	function addReview(reviewResponse: IndexedCommentsResponse[]) {
		const children = originalChildren
		if (!children) return
		const resp = convertReviewResponse(reviewResponse, children)
		if (!resp.comments.length) return
		resp.comments.forEach((comment) => {
			if (!comment?.id || !comment?.text) return
			addComment({
				value: [
					{
						type: ParagraphPlugin.key,
						children: [
							{
								text: comment.text
									.trim()
									.replaceAll('•', '-')
									.replace(/(?<=\s)-/g, '\n-')
									.replace('</comment_format> <comment_format>', ''),
							},
						],
					},
				],
				id: comment.id,
				userId: AI_USER_ID,
				createdAt: Date.now(),
			})
		})
		editor.tf.setValue(breakDownValue(resp.value))
	}

	function removeReview() {
		if (!reviewStreaming || !responses[reviewStreaming]) return
		const reviewResponse = parse(
			jsonrepair(responses[reviewStreaming].join(''))
		) as IndexedCommentsResponse[]
		const children = originalChildren
		if (!children) return
		const resp = convertReviewResponse(reviewResponse, children)
		resp.comments.forEach((comment) => {
			api.comment.removeComment(comment.id)
		})
		editor.tf.setValue(breakDownValue(children))
	}

	useEffect(() => {
		if (!isPending && aiResponse) {
			if (requestedAction === EChatMode.REVIEW) {
				setOriginalChildren(children)
				setReviewStreaming(aiResponse)
				addMessages({
					taskId: aiResponse,
					role: EMessenger.ASSISTANT,
					action: EAction.REVIEW,
					content: 'Erstelle Review...',
				})
			} else if (requestedAction === EChatMode.SFX) {
				setOriginalChildren(children)
				setSfxStreaming(aiResponse)
				addMessages({
					taskId: aiResponse,
					role: EMessenger.ASSISTANT,
					action: EAction.CHANGES,
					content: 'Erstelle MUSIC/SFX/AMBIENT Tags...',
				})
			} else if (requestedAction === EChatMode.VOICE) {
				setOriginalChildren(children)
				addMessages({
					taskId: aiResponse,
					role: EMessenger.ASSISTANT,
					action: EAction.VOICE,
					content: 'Voice Pass ist aktiv...',
				})
			} else {
				handleBlock({ text: '', taskId: aiResponse })
			}
			setRequestedAction(null)
		}
	}, [aiResponse, isPending])

	useEffect(() => {
		if (!sfxStreaming || !originalChildren) return
		if (taskEnded[sfxStreaming]) {
			setSfxStreaming('')
			setOriginalChildren(undefined)
			return
		}
		if (!responses[sfxStreaming]) return

		try {
			let parsedResponse = parseOptimistically<IndexedSFXResponse>(
				responses[sfxStreaming].join('')
			)
			if (!parsedResponse) return
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
			if (!parsedResponse.length) return
			const responseValue = addSFX(
				parsedResponse,
				originalChildren,
				ParagraphPlugin.key
			)
			setResponseValue(structuredClone(responseValue))
			setPrevValue(structuredClone(children))
		} catch (error) {
			console.log(error)
		}
	}, [
		sfxStreaming,
		responses[sfxStreaming],
		taskEnded[sfxStreaming],
		originalChildren,
	])

	useEffect(() => {
		if (!reviewStreaming || !originalChildren) return
		if (taskEnded[reviewStreaming]) {
			setReviewStreaming('')
			updateMessages(
				{
					role: EMessenger.ASSISTANT,
					action: EAction.REVIEW,
					content: 'StoryChat added review in comments',
					taskId: reviewStreaming,
				},
				messages.length - 1
			)
			setOriginalChildren(undefined)
			return
		}
		if (!responses[reviewStreaming]) return
		try {
			const parsedResponse = parseOptimistically<IndexedCommentsResponse[]>(
				responses[reviewStreaming].join('')
			)
			if (!parsedResponse) return
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
		if (!blockStreaming) return
		if (taskEnded[blockStreaming]) {
			const lastIndex = messages.length - 1
			if (lastIndex >= 0) {
				updateMessages(
					{
						...messages[lastIndex],
						content:
							responses[blockStreaming].join('') ||
							'Tut mir leid, darauf habe ich im Moment keine Antwort.',
					},
					lastIndex
				)
			}
			setBlockStreaming('')
		}
	}, [blockStreaming, taskEnded[blockStreaming]])

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
		cancelRequest,
		clearMessages,
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

'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { nanoid } from 'nanoid'

import useEpisodeTableContext from '@/providers/episode-table-provider'

import {
	EStoryExpansionTab,
	TConversationSummary,
	TMessage,
	TParameter,
	TParameterSummary,
	TPlan,
	TRange,
	TSelectedItem,
} from './lib/types'

function useStoryExpansionUtil() {
	const { initialStoryData, storyDataFetching } = useEpisodeTableContext()
	const episodeCount = initialStoryData?.episode_count || 0

	// Tab state
	const [storyExpansionTab, setStoryExpansionTab] =
		useState<EStoryExpansionTab>(EStoryExpansionTab.RANGE)

	// Range state
	const [range, setRange] = useState<TRange>({
		start: episodeCount,
		end: episodeCount + 10,
	})

	// Update range when episodeCount changes
	useEffect(() => {
		setRange({
			start: episodeCount,
			end: episodeCount + 10,
		})
	}, [episodeCount])

	// Chat state
	const [chatMessages, setChatMessages] = useState<TMessage[]>([])
	const [chatInput, setChatInput] = useState('')
	const [conversationSummary, setConversationSummary] =
		useState<TConversationSummary | null>(null)

	// Parameters state
	const [parameters, setParameters] = useState<TParameter>({
		character: '',
		plot: '',
		world: '',
		focus: null,
	})
	const [parameterSummary, setParameterSummary] =
		useState<TParameterSummary | null>(null)

	// Review state
	const [plan, setPlan] = useState<TPlan | null>(null)
	const [selectedItem, setSelectedItem] = useState<TSelectedItem>({
		type: null,
	})
	const [reviewChatMessages, setReviewChatMessages] = useState<TMessage[]>([])
	const [reviewChatInput, setReviewChatInput] = useState('')

	// Mock mutation for saving conversation summary
	const saveConversationSummaryMutation = useMutation({
		mutationKey: ['save-conversation-summary'],
		mutationFn: async () => {
			await new Promise((resolve) => setTimeout(resolve, 1000))
			return {
				content: `Summary of conversation with ${chatMessages.length} messages. Key themes: character development, plot progression, and world-building elements discussed.`,
			} as TConversationSummary
		},
		onSuccess: (data) => {
			setConversationSummary(data)
		},
	})

	// Mock mutation for finalizing rewrite plan from chat
	const finalizePlanFromChatMutation = useMutation({
		mutationKey: ['finalize-plan-from-chat'],
		mutationFn: async () => {
			await new Promise((resolve) => setTimeout(resolve, 1000))
			const mockPlan: TPlan = {
				arcs: [
					{
						id: nanoid(),
						name: 'Arc 1: Introduction',
						episodes: [
							{
								id: nanoid(),
								name: 'Episode 1',
								summary: 'Opening episode summary',
							},
							{
								id: nanoid(),
								name: 'Episode 2',
								summary: 'Second episode summary',
							},
						],
					},
					{
						id: nanoid(),
						name: 'Arc 2: Development',
						episodes: [
							{
								id: nanoid(),
								name: 'Episode 3',
								summary: 'Third episode summary',
							},
						],
					},
				],
			}
			return mockPlan
		},
		onSuccess: (data) => {
			setPlan(data)
			setStoryExpansionTab(EStoryExpansionTab.REVIEW)
		},
	})

	// Mock mutation for saving parameter summary
	const saveParameterSummaryMutation = useMutation({
		mutationKey: ['save-parameter-summary'],
		mutationFn: async () => {
			await new Promise((resolve) => setTimeout(resolve, 1000))
			return {
				content: `Parameters summary: Character focus: ${parameters.character || 'Not specified'}, Plot: ${parameters.plot || 'Not specified'}, World: ${parameters.world || 'Not specified'}`,
			} as TParameterSummary
		},
		onSuccess: (data) => {
			setParameterSummary(data)
		},
	})

	// Mock mutation for finalizing rewrite plan from parameters
	const finalizePlanFromParametersMutation = useMutation({
		mutationKey: ['finalize-plan-from-parameters'],
		mutationFn: async () => {
			await new Promise((resolve) => setTimeout(resolve, 1000))
			const mockPlan: TPlan = {
				arcs: [
					{
						id: nanoid(),
						name: 'Arc 1: Character Arc',
						episodes: [
							{
								id: nanoid(),
								name: 'Episode 1',
								summary: 'Character introduction',
							},
							{
								id: nanoid(),
								name: 'Episode 2',
								summary: 'Character development',
							},
						],
					},
				],
			}
			return mockPlan
		},
		onSuccess: (data) => {
			setPlan(data)
			setStoryExpansionTab(EStoryExpansionTab.REVIEW)
		},
	})

	// Mock mutation for sending chat message
	const sendChatMessageMutation = useMutation({
		mutationKey: ['send-chat-message'],
		mutationFn: async (message: string) => {
			await new Promise((resolve) => setTimeout(resolve, 1000))
			return {
				id: nanoid(),
				role: 'assistant' as const,
				content: `AI response to: "${message}". This is a mock response.`,
				timestamp: new Date(),
			} as TMessage
		},
		onSuccess: (response) => {
			setChatMessages((prev) => [...prev, response])
			setChatInput('')
		},
	})

	// Mock mutation for sending review chat message
	const sendReviewChatMessageMutation = useMutation({
		mutationKey: ['send-review-chat-message'],
		mutationFn: async (message: string) => {
			await new Promise((resolve) => setTimeout(resolve, 1000))
			return {
				id: nanoid(),
				role: 'assistant' as const,
				content: `Review AI response to: "${message}". This is a mock response.`,
				timestamp: new Date(),
			} as TMessage
		},
		onSuccess: (response) => {
			setReviewChatMessages((prev) => [...prev, response])
			setReviewChatInput('')
		},
	})

	// Mock mutation for generating episodes
	const generateEpisodesMutation = useMutation({
		mutationKey: ['generate-episodes'],
		mutationFn: async () => {
			await new Promise((resolve) => setTimeout(resolve, 2000))
			return { success: true }
		},
	})

	// Functions
	const handleSendChatMessage = useCallback(() => {
		if (!chatInput.trim()) {
			return
		}

		const userMessage: TMessage = {
			id: nanoid(),
			role: 'user',
			content: chatInput,
			timestamp: new Date(),
		}

		setChatMessages((prev) => [...prev, userMessage])
		sendChatMessageMutation.mutate(chatInput)
	}, [chatInput, sendChatMessageMutation])

	const handleSendReviewChatMessage = useCallback(() => {
		if (!reviewChatInput.trim()) {
			return
		}

		const userMessage: TMessage = {
			id: nanoid(),
			role: 'user',
			content: reviewChatInput,
			timestamp: new Date(),
		}

		setReviewChatMessages((prev) => [...prev, userMessage])
		sendReviewChatMessageMutation.mutate(reviewChatInput)
	}, [reviewChatInput, sendReviewChatMessageMutation])

	const handleSaveConversationSummary = useCallback(() => {
		saveConversationSummaryMutation.mutate()
	}, [saveConversationSummaryMutation])

	const handleFinalizePlanFromChat = useCallback(() => {
		finalizePlanFromChatMutation.mutate()
	}, [finalizePlanFromChatMutation])

	const handleSaveParameterSummary = useCallback(() => {
		saveParameterSummaryMutation.mutate()
	}, [saveParameterSummaryMutation])

	const handleFinalizePlanFromParameters = useCallback(() => {
		finalizePlanFromParametersMutation.mutate()
	}, [finalizePlanFromParametersMutation])

	const handleGenerateEpisodes = useCallback(() => {
		generateEpisodesMutation.mutate()
	}, [generateEpisodesMutation])

	const updateArcName = useCallback((arcId: string, name: string) => {
		setPlan((prev) => {
			if (!prev) {
				return prev
			}
			return {
				...prev,
				arcs: prev.arcs.map((arc) =>
					arc.id === arcId ? { ...arc, name } : arc
				),
			}
		})
	}, [])

	const updateEpisodeName = useCallback(
		(arcId: string, episodeId: string, name: string) => {
			setPlan((prev) => {
				if (!prev) {
					return prev
				}
				return {
					...prev,
					arcs: prev.arcs.map((arc) =>
						arc.id === arcId
							? {
									...arc,
									episodes: arc.episodes.map((ep) =>
										ep.id === episodeId ? { ...ep, name } : ep
									),
								}
							: arc
					),
				}
			})
		},
		[]
	)

	const updateEpisodeSummary = useCallback(
		(arcId: string, episodeId: string, summary: string) => {
			setPlan((prev) => {
				if (!prev) {
					return prev
				}
				return {
					...prev,
					arcs: prev.arcs.map((arc) =>
						arc.id === arcId
							? {
									...arc,
									episodes: arc.episodes.map((ep) =>
										ep.id === episodeId ? { ...ep, summary } : ep
									),
								}
							: arc
					),
				}
			})
		},
		[]
	)

	return {
		// Tab state
		storyExpansionTab,
		setStoryExpansionTab,

		// Range state
		range,
		setRange,
		episodeCount,
		storyDataFetching,

		// Chat state
		chatMessages,
		setChatMessages,
		chatInput,
		setChatInput,
		conversationSummary,
		handleSendChatMessage,
		handleSaveConversationSummary,
		handleFinalizePlanFromChat,
		isSavingConversationSummary: saveConversationSummaryMutation.isPending,
		isFinalizingFromChat: finalizePlanFromChatMutation.isPending,
		isSendingChatMessage: sendChatMessageMutation.isPending,

		// Parameters state
		parameters,
		setParameters,
		parameterSummary,
		handleSaveParameterSummary,
		handleFinalizePlanFromParameters,
		isSavingParameterSummary: saveParameterSummaryMutation.isPending,
		isFinalizingFromParameters: finalizePlanFromParametersMutation.isPending,

		// Review state
		plan,
		selectedItem,
		setSelectedItem,
		reviewChatMessages,
		setReviewChatMessages,
		reviewChatInput,
		setReviewChatInput,
		handleSendReviewChatMessage,
		handleGenerateEpisodes,
		updateArcName,
		updateEpisodeName,
		updateEpisodeSummary,
		isSendingReviewMessage: sendReviewChatMessageMutation.isPending,
		isGeneratingEpisodes: generateEpisodesMutation.isPending,
	}
}

type TStoryExpansionContext = ReturnType<typeof useStoryExpansionUtil>
const StoryExpansionContext =
	React.createContext<TStoryExpansionContext | null>(null)

export function StoryExpansionContextProvider({
	children,
}: React.PropsWithChildren) {
	const value = useStoryExpansionUtil()

	return (
		<StoryExpansionContext.Provider value={value}>
			{children}
		</StoryExpansionContext.Provider>
	)
}

export default function useStoryExpansion() {
	const context = React.useContext(StoryExpansionContext)
	if (!context) {
		throw new Error(
			'useStoryExpansion must be used within a StoryExpansionContextProvider'
		)
	}
	return context
}

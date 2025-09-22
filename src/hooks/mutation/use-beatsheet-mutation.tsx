import { useState } from 'react'
import { useParams } from 'next/navigation'
import { API_URLS } from '@/constants/global-constants'
import { GENERATE_BEATSHEET_MUTATION_KEY } from '@/constants/query-constants'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

import {
	TGenerateBeatsheetBody,
	TGenerateBeatsheetResponse,
} from '@/types/beatsheet-editor-types'

import useSocket from '../use-socket'

const useBeatsheetMutation = () => {
	const { id } = useParams()
	const { startTask, getResponse } = useSocket()
	const [generatingSceneIds, setGeneratingSceneIds] = useState<string[]>([])
	const [pendingApprovalContent, setPendingApprovalContent] = useState<
		Record<string, TGenerateBeatsheetResponse>
	>({})
	const [timeoutProgress, setTimeoutProgress] = useState<number>(0)

	const onSuccess = () => {
		toast.success('Beatsheet generated successfully')
		setGeneratingSceneIds([])
		setTimeoutProgress(0)
	}

	const onError = (error: Error) => {
		toast.error(error.message)
		setGeneratingSceneIds([])
		setPendingApprovalContent({})
		setTimeoutProgress(0)
	}

	const onTimeout = (isSingleGeneration: boolean) => {
		const timeoutMessage = isSingleGeneration
			? 'Scene generation timed out after 1 minute. Please try again.'
			: 'Generate all operation timed out after 3 minutes. Please try again.'
		toast.error(timeoutMessage)
		setGeneratingSceneIds([])
		setPendingApprovalContent({})
		setTimeoutProgress(0)
	}

	const onGenerateBeatsheetMutation = async ({
		params,
		sceneIds,
	}: {
		params: TGenerateBeatsheetBody
		sceneIds: string[]
	}) => {
		const isSingleGeneration = sceneIds.length === 1
		const timeoutDuration = isSingleGeneration ? 60000 : 180000 // 1 min for single, 3 min for all

		setGeneratingSceneIds(sceneIds)
		setTimeoutProgress(100) // Start at 100%

		// Create a progress tracker
		const progressInterval = setInterval(() => {
			setTimeoutProgress((prev) => {
				const newProgress = Math.max(0, prev - 100 / (timeoutDuration / 1000))
				return newProgress
			})
		}, 1000)

		const taskId = await startTask<TGenerateBeatsheetBody, { message: string }>(
			{
				method: 'POST',
				url: params.scene_wide_prompt
					? API_URLS.SCENE_PROMPT_GENERATE
					: API_URLS.BEATSHEET_GENERATE,
				body: params,
			}
		)

		// Create a timeout promise
		const timeoutPromise = new Promise<never>((_, reject) => {
			setTimeout(() => {
				clearInterval(progressInterval)
				reject(
					new Error(
						`Generation timed out after ${timeoutDuration / 1000} seconds`
					)
				)
			}, timeoutDuration)
		})

		// Race between the response and timeout
		try {
			const resp = await Promise.race([getResponse(taskId), timeoutPromise])
			clearInterval(progressInterval)
			setTimeoutProgress(0)
			return resp as TGenerateBeatsheetResponse
		} catch (error) {
			clearInterval(progressInterval)
			if (error instanceof Error && error.message.includes('timed out')) {
				onTimeout(isSingleGeneration)
				throw new Error(error.message)
			}
			throw error
		}
	}

	const generateBeatsheetMutation = useMutation({
		mutationKey: [GENERATE_BEATSHEET_MUTATION_KEY, Number(id)],
		mutationFn: onGenerateBeatsheetMutation,
		onSuccess: (data) => {
			if (data && data.length > 0) {
				const newPendingContent: Record<string, TGenerateBeatsheetResponse> = {}
				data.forEach((sceneData, index) => {
					const sceneId = generatingSceneIds[index]
					newPendingContent[sceneId] = [{ ...sceneData, id: sceneId }]
				})
				setPendingApprovalContent((prev) => ({ ...prev, ...newPendingContent }))
			}
			setGeneratingSceneIds([])
		},
		onError: (error: Error) => onError(error),
	})

	const approveContent = (sceneId: string) => {
		setPendingApprovalContent((prev) => {
			const newState = { ...prev }
			delete newState[sceneId]
			return newState
		})
		onSuccess()
	}

	const rejectContent = (sceneId: string) => {
		setPendingApprovalContent((prev) => {
			const newState = { ...prev }
			delete newState[sceneId]
			return newState
		})
		toast.info('Generated content rejected')
	}

	const getPendingContentForScene = (sceneId: string) => {
		return pendingApprovalContent[sceneId] || null
	}

	const hasAnyPendingContent = () => {
		return Object.keys(pendingApprovalContent).length > 0
	}

	const clearError = () => {
		generateBeatsheetMutation.reset()
	}

	return {
		...generateBeatsheetMutation,
		generatingSceneIds,
		pendingApprovalContent,
		approveContent,
		rejectContent,
		getPendingContentForScene,
		hasAnyPendingContent,
		clearError,
		timeoutProgress,
	}
}

export default useBeatsheetMutation

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { API_URLS } from '@/constants/global-constants'
import { GENERATE_BEATSHEET_MUTATION_KEY } from '@/constants/query-constants'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

import {
	TGenerateBeatsheetBody,
	TGenerateBeatsheetResponse,
} from '@/types/ai-types'

import useSocket from '../use-socket'

const useBeatsheetMutation = () => {
	const { id } = useParams()
	const { startTask, getResponse } = useSocket()
	const [generatingSceneIds, setGeneratingSceneIds] = useState<string[]>([])
	const [pendingApprovalContent, setPendingApprovalContent] = useState<
		Record<string, TGenerateBeatsheetResponse>
	>({})

	const onSuccess = () => {
		toast.success('Beatsheet generated successfully')
		setGeneratingSceneIds([])
	}

	const onError = (error: Error) => {
		toast.error(error.message)
		setGeneratingSceneIds([])
		setPendingApprovalContent({})
	}

	const onGenerateBeatsheetMutation = async (
		params: TGenerateBeatsheetBody
	) => {
		const sceneIds = Object.keys(params.scene_texts)
		setGeneratingSceneIds(sceneIds)

		const taskId = await startTask<TGenerateBeatsheetBody, { message: string }>(
			{
				method: 'POST',
				url: API_URLS.BEATSHEET_GENERATE,
				body: params,
			}
		)

		const resp = await getResponse(taskId)

		return resp as TGenerateBeatsheetResponse

		// await new Promise((resolve) => setTimeout(resolve, 2000))

		// const resp: TGenerateBeatsheetResponse = []
		// for (const sceneId of sceneIds) {
		// 	resp.push({
		// 		id: sceneId,
		// 		content:
		// 			generatedContent.find((scene) => scene.id === sceneId)?.content || '',
		// 	})
		// }
		// return resp
	}

	const generateBeatsheetMutation = useMutation({
		mutationKey: [GENERATE_BEATSHEET_MUTATION_KEY, Number(id)],
		mutationFn: onGenerateBeatsheetMutation,
		onSuccess: (data) => {
			if (data && data.length > 0) {
				const newPendingContent: Record<string, TGenerateBeatsheetResponse> = {}
				data.forEach((sceneData) => {
					newPendingContent[sceneData.id] = [sceneData]
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

	return {
		...generateBeatsheetMutation,
		generatingSceneIds,
		pendingApprovalContent,
		approveContent,
		rejectContent,
		getPendingContentForScene,
		hasAnyPendingContent,
	}
}

export default useBeatsheetMutation

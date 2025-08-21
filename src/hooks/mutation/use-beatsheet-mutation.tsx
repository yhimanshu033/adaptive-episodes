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

	const onSuccess = () => {
		toast.success('Beatsheet generated successfully')
	}

	const onError = (error: Error) => {
		toast.error(error.message)
	}

	const onGenerateBeatsheetMutation = async (
		params: TGenerateBeatsheetBody
	) => {
		const taskId = await startTask<TGenerateBeatsheetBody, { message: string }>(
			{
				method: 'POST',
				url: API_URLS.BEATSHEET_GENERATE,
				body: params,
			}
		)

		const resp = await getResponse(taskId)

		return resp as TGenerateBeatsheetResponse
	}

	const generateBeatsheetMutation = useMutation({
		mutationKey: [GENERATE_BEATSHEET_MUTATION_KEY, Number(id)],
		mutationFn: onGenerateBeatsheetMutation,
		onSuccess,
		onError: (error: Error) => onError(error),
	})

	return generateBeatsheetMutation
}

export default useBeatsheetMutation

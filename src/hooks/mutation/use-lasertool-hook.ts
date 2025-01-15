'use client'

import useSocket from '@/hooks/use-socket'
import { useMutation } from '@tanstack/react-query'

import { LaserToolsApiResponse, LaserToolsParams } from '@/types/ai-types'

const useLaserToolsHook = () => {
	const { startTask, getResponse } = useSocket()
	async function onRephraseMutation(params: LaserToolsParams) {
		const taskId = await startTask<LaserToolsParams>({
			method: 'POST',
			url: '/aicopilot/lasertools',
			body: params,
		})
		const response: LaserToolsApiResponse['data'] = await getResponse(taskId)
		return response
	}
	const laserToolsMutation = useMutation({
		mutationKey: ['lasertools'],
		mutationFn: onRephraseMutation,
	})
	return { laserToolsMutation }
}
export default useLaserToolsHook

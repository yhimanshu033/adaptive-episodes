'use client'

import useSocket from '@/hooks/use-socket'
import { useQuery } from '@tanstack/react-query'

import { LaserToolsApiResponse, LaserToolsParams } from '@/types/ai-types'

const useLaserToolsQuery = (key: string | null, params: LaserToolsParams) => {
	const { startTask, getResponse } = useSocket()
	async function onRephraseFn() {
		if (!key) return
		const taskId = await startTask<LaserToolsParams>({
			method: 'POST',
			url: '/aicopilot/lasertools',
			body: params,
			noCache: true,
		})
		const response: LaserToolsApiResponse['data'] = await getResponse(taskId)
		return response
	}
	const laserToolsQuery = useQuery({
		queryKey: ['lasertools', key],
		queryFn: onRephraseFn,
		staleTime: Infinity,
	})
	const { data: actualData, isFetching } = laserToolsQuery
	return { ...laserToolsQuery, data: isFetching ? undefined : actualData }
}
export default useLaserToolsQuery

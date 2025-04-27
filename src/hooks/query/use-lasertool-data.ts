'use client'

import { API_URLS } from '@/constants/global-constants'
import { LASERTOOLS_QUERY_KEY } from '@/constants/query-constants'
import useSocket from '@/hooks/use-socket'
import { useQuery } from '@tanstack/react-query'

import { LaserToolsApiResponse, LaserToolsParams } from '@/types/ai-types'

const useLaserToolsQuery = (key: string | null, params: LaserToolsParams) => {
	const { startTask, getResponse } = useSocket()
	async function onRephraseFn() {
		if (!key) {
			return
		}
		const taskId = await startTask<LaserToolsParams>({
			method: 'POST',
			url: API_URLS.STREAM_LASER,
			body: params,
			noCache: true,
		})
		const response: LaserToolsApiResponse['data'] = await getResponse(taskId)
		return response
	}
	const laserToolsQuery = useQuery({
		queryKey: [LASERTOOLS_QUERY_KEY, key],
		queryFn: onRephraseFn,
		staleTime: Infinity,
	})
	const { data: actualData, isFetching } = laserToolsQuery
	return { ...laserToolsQuery, data: isFetching ? undefined : actualData }
}
export default useLaserToolsQuery

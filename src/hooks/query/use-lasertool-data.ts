'use client'

import { API_URLS } from '@/constants/global-constants'
import { LASERTOOLS_QUERY_KEY } from '@/constants/query-constants'
import useSocket from '@/hooks/use-socket'
import { useQuery } from '@tanstack/react-query'

import useProjectId from '@/providers/project-id-provider'

import { LaserToolsApiResponse, LaserToolsParams } from '@/types/ai-types'

const useLaserToolsQuery = (key: string | null, params: LaserToolsParams) => {
	const { startTask, getResponse } = useSocket()
	const { projectId } = useProjectId()
	async function onRephraseFn() {
		if (!key || !projectId) {
			return
		}
		const taskId = await startTask<LaserToolsParams>({
			method: 'POST',
			url: API_URLS.STREAM_LASER,
			body: {
				...params,
				project_id: Number(projectId),
			},
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

import { useParams } from 'next/navigation'
import { API_URLS } from '@/constants/global-constants'
import { BASE_EXTENSION_QUERY_KEY } from '@/constants/query-constants'
import { useQuery } from '@tanstack/react-query'

import { FetchResponseResult } from '@/lib/fetch-api'

import { TBaseScriptExtensionResponse } from '@/types/admin-types'
import { TNoParams } from '@/types/common'

import useSocket from '../use-socket'
import useGDriveAuth from './use-gdrive-auth'

type GetBaseResponse<T> = FetchResponseResult<T> | T

const useBaseExtensionQuery = (enabled: boolean) => {
	const { id } = useParams()
	const { startTask, getResponse } = useSocket()
	const { redirectToGDriveAuth } = useGDriveAuth()

	const getBaseExtensionData = async () => {
		const taskId = await startTask<
			TNoParams,
			TBaseScriptExtensionResponse,
			{ projectId: number }
		>({
			method: 'GET',
			url: API_URLS.GET_BASE_SCRIPT_EXTENSION,
			urlParams: { projectId: Number(id) },
			noCache: true,
		})

		const resp =
			await getResponse<GetBaseResponse<TBaseScriptExtensionResponse>>(taskId)

		if ('status' in resp) {
			if (resp.status === 401) {
				await redirectToGDriveAuth()
			}
			if (resp.status === 400) {
				return {
					message: 'Base script extension is currently running in background',
				}
			}
			return resp.data
		}
		return resp
	}
	const baseExtensionQuery = useQuery({
		queryKey: [BASE_EXTENSION_QUERY_KEY, Number(id)],
		queryFn: getBaseExtensionData,
		enabled,
	})
	return baseExtensionQuery
}

export default useBaseExtensionQuery

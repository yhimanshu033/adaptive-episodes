import { useParams } from 'next/navigation'
import { API_URLS } from '@/constants/global-constants'
import { BASE_EXTENSION_QUERY_KEY } from '@/constants/query-constants'
import { useQuery } from '@tanstack/react-query'

import { fetchAPI } from '@/lib/fetch-api'

import { TBaseScriptExtensionResponse } from '@/types/admin-types'

import useGDriveAuth from './use-gdrive-auth'

const useBaseExtensionQuery = (enabled: boolean) => {
	const { id } = useParams()
	const { redirectToGDriveAuth } = useGDriveAuth()

	const getBaseExtensionData = async () => {
		const resp = await fetchAPI<
			TBaseScriptExtensionResponse,
			{ projectId: number }
		>({
			method: 'GET',
			url: API_URLS.GET_BASE_SCRIPT_EXTENSION,
			urlParams: { projectId: Number(id) },
		})

		if (!resp.success) {
			if (resp.status === 401) {
				await redirectToGDriveAuth()
			}
			if (resp.status === 400 && !resp.success) {
				return {
					message: 'Base script extension is currently running in background',
					taskId: resp?.message?.task_id,
				}
			}
			return resp.data
		}
		return resp.data
	}
	const baseExtensionQuery = useQuery({
		queryKey: [BASE_EXTENSION_QUERY_KEY, Number(id)],
		queryFn: getBaseExtensionData,
		enabled,
		gcTime: 0,
	})
	return baseExtensionQuery
}

export default useBaseExtensionQuery

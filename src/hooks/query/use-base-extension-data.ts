import { useParams } from 'next/navigation'
import { API_URLS } from '@/constants/global-constants'
import { BASE_EXTENSION_QUERY_KEY } from '@/constants/query-constants'
import { useQuery } from '@tanstack/react-query'

import { fetchAPI } from '@/lib/fetch-api'

import {
	TBSEGermanResponse,
	TBSEResponse,
	TBSERunningResponse,
} from '@/types/admin-types'
import { TNoParams } from '@/types/common'

import useGDriveAuth from './use-gdrive-auth'

const useBaseExtensionQuery = (enabled: boolean) => {
	const { id } = useParams()
	const { redirectToGDriveAuth } = useGDriveAuth()

	const getBaseExtensionData = async () => {
		const resp = await fetchAPI<
			TBSEGermanResponse,
			{ projectId: number },
			TNoParams,
			TNoParams,
			TBSEResponse | TBSERunningResponse
		>({
			method: 'GET',
			url: API_URLS.GET_BASE_SCRIPT_EXTENSION,
			urlParams: { projectId: Number(id) },
		})

		if (!resp.success) {
			if (resp.status === 401) {
				await redirectToGDriveAuth()
				return
			} else if (resp.status === 400) {
				const errorData =
					resp.message ?? ({} as TBSEResponse | TBSERunningResponse)

				return {
					...errorData,
					message: 'Base script extension is currently running in background',
				}
			}
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

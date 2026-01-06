import { API_URLS } from '@/constants/global-constants'

import { fetchAPI } from '@/lib/fetch-api'

import {
	TGetLOCSheetResponse,
	TLOCUrlParams,
	TUpdateLOCSheetBody,
} from '@/types/localization-types'

export const updateLOCSheet = async (
	projectId: number,
	params: TUpdateLOCSheetBody
) => {
	const resp = await fetchAPI<
		{ message: string },
		TLOCUrlParams,
		TUpdateLOCSheetBody
	>({
		method: 'PATCH',
		url: API_URLS.UPDATE_LOC_SHEET,
		urlParams: {
			projectId,
		},
		body: params,
	})

	if (!resp.success) {
		throw resp.error
	}
	return resp.data
}

export const getLOCSheet = async (projectId: number) => {
	const resp = await fetchAPI<TGetLOCSheetResponse, TLOCUrlParams>({
		method: 'GET',
		url: API_URLS.GET_LOC_SHEET,
		urlParams: {
			projectId,
		},
	})
	return resp.data
}

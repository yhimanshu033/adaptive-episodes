
import { API_URLS } from '@/constants/global-constants'

import { fetchAPI } from '@/lib/fetch-api'
import { convertMetadata } from '@/lib/utils/helpers'

import { ELanguage, TNoParams } from '@/types/common'
import {
	TGetMetadataAPIResponse,
	TLanguageQueryParams,
	TMetadataUrlParams,
} from '@/types/content-types'

export const getMetadata = async (
	projectId: number,
	startSequence: number,
	endSequence: number,
	input_language: ELanguage = ELanguage.GERMAN_ORIGINAL
) => {
	const url =
		input_language === ELanguage.GERMAN_ORIGINAL
			? API_URLS.GET_METADATA
			: API_URLS.GET_METADATA_BASE
	const metadata = await fetchAPI<
		TGetMetadataAPIResponse,
		TMetadataUrlParams,
		TNoParams,
		TLanguageQueryParams
	>({
		method: 'GET',
		url,
		defaultData: {
			data: {},
		},
		urlParams: {
			projectId,
			startSequence,
			endSequence,
		},
		query: {
			input_language,
		},
	})
	const newData = convertMetadata(metadata.data)
	return { ...metadata, data: newData }
}

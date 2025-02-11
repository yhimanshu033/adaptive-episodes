'use server'

import { fetchAPI } from '@/lib/fetch-api'
import { convertMetadata } from '@/lib/utils/helpers'

import {
	TGetMetadataAPIResponse,
	TMetadataUrlParams,
} from '@/types/content-types'

export const getMetadata = async (
	projectId: number,
	startSequence: number,
	endSequence: number
) => {
	const metadata = await fetchAPI<TGetMetadataAPIResponse, TMetadataUrlParams>({
		method: 'GET',
		url: '/adapted-metadata/:projectId/:startSequence/:endSequence',
		defaultData: {
			data: {},
		},
		urlParams: {
			projectId,
			startSequence,
			endSequence,
		},
	})
	const newData = convertMetadata(metadata.data)
	return { ...metadata, data: newData }
}

'use server'

import { fetchAPI } from '@/lib/fetch-api'

import { TGetMetadataResponse, TMetadataUrlParams } from '@/types/content-types'

export const getMetadata = async (
	projectId: number,
	startSequence: number,
	endSequence: number
) => {
	const metadata = await fetchAPI<TGetMetadataResponse, TMetadataUrlParams>({
		method: 'GET',
		url: '/metadata/:projectId/:startSequence/:endSequence',
		defaultData: {
			data: {},
		},
		urlParams: {
			projectId,
			startSequence,
			endSequence,
		},
	})
	return metadata
}

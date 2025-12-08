import { API_URLS } from '@/constants/global-constants'
import { useMutation } from '@tanstack/react-query'

import { fetchAPI } from '@/lib/fetch-api'
import { uploadTextToPresignedUrl } from '@/lib/utils/gcs'

import { TNoParams } from '@/types/common'
import {
	TGetPresignedUrlRequest,
	TGetPresignedUrlResponse,
} from '@/types/episode-type'

export function usePresignedUrlMutation() {
	async function getPresignedUrl(body: TGetPresignedUrlRequest) {
		const resp = await fetchAPI<
			TGetPresignedUrlResponse,
			TNoParams,
			TGetPresignedUrlRequest
		>({
			method: 'POST',
			url: API_URLS.GET_PRESIGNED_CONTENT_URL,
			body,
		})

		return resp
	}

	const mutation = useMutation({
		mutationFn: getPresignedUrl,
	})

	return mutation
}

export function useUpdatePresignedUrlMutation() {
	const mutation = useMutation({
		mutationFn: uploadTextToPresignedUrl,
	})

	return mutation
}

'use server'

import { API_URLS } from '@/constants/global-constants'

import { fetchAPI } from '@/lib/fetch-api'

import { TNoParams } from '@/types/common'

export const uploadFile = async (file: File) => {
	const formData = new FormData()
	formData.append('file', file)
	const stories = await fetchAPI<{ url: string }, TNoParams, FormData>({
		method: 'POST',
		url: API_URLS.FILE_UPLOAD,
		body: formData,
	})

	return stories.data
}

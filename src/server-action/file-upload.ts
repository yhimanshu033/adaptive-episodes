'use server'

import { fetchAPI } from '@/lib/fetch-api'

import { TNoParams } from '@/types/common'

export const uploadFile = async (file: File) => {
	const formData = new FormData()
	formData.append('file', file)
	const stories = await fetchAPI<{ url: string }, TNoParams, FormData>({
		method: 'POST',
		url: '/project/file-upload/',
		body: formData,
		onError: (error) => {
			const { message } = error
			throw new Error(message || 'Unable to upload file')
		},
	})

	return stories.data
}

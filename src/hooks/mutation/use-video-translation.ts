import { PROMO_PAGE } from '@/constants/german-constants'
import { API_URLS } from '@/constants/global-constants'
import { TRANSLATE_VIDEO_MUTATION_KEY } from '@/constants/query-constants'
import { useMutation } from '@tanstack/react-query'

import { fetchAPI } from '@/lib/fetch-api'

import { TVideoTranslationResponse } from '@/types/ai-types'
import { TNoParams } from '@/types/common'

async function translateVideo({ file }: { file: File }) {
	const formData = new FormData()
	formData.append('video_file', file)

	const response = await fetchAPI<
		TVideoTranslationResponse,
		TNoParams,
		FormData
	>({
		method: 'POST',
		url: API_URLS.TRANSLATE_VIDEO,
		body: formData,
	})

	return response.data?.translation || PROMO_PAGE.TRANSCRIPTION_FAILED
}

export default function useVideoTranslation() {
	const translateVideoMutation = useMutation({
		mutationKey: [TRANSLATE_VIDEO_MUTATION_KEY],
		mutationFn: translateVideo,
	})

	return translateVideoMutation
}

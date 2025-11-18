import {
	usePresignedUrlMutation,
	useUpdatePresignedUrlMutation,
} from '@/hooks/mutation/use-presigned-url-mutation'
import useEpisodeContent from '@/hooks/query/use-episode-content'
import useHandleSavingResponse from '@/hooks/use-handle-saving-response'
import { saveContent } from '@/server-action/content-action'
import * as Sentry from '@sentry/nextjs'
import { useMutation } from '@tanstack/react-query'

type TLocallyStoredPresignedUrlItem = {
	time: number
	url: string
}

type TComputePresignedUrlIdParams = { episode: string; story: string }

function computePresignedUrlsId({
	episode,
	story,
}: TComputePresignedUrlIdParams) {
	return `PRESIGNED_URL_${story}_${episode}`
}

const DEFAULT_TTL = 10 // 10 minutes
const PRESIGNED_FETCH_OFFSET = 20 * 1000 // 20 secs offset

function getStoredPresignedUrl({
	episode,
	story,
}: TComputePresignedUrlIdParams) {
	const defaultPresignedUrl = ''
	const key = computePresignedUrlsId({ story, episode })
	const presignedUrlData = localStorage.getItem(key)

	if (!presignedUrlData) {
		return defaultPresignedUrl
	}

	try {
		const parsed = (JSON.parse(presignedUrlData) ??
			{}) as TLocallyStoredPresignedUrlItem
		const storedUrlItem = parsed

		if (
			!storedUrlItem?.url ||
			!storedUrlItem.time ||
			isNaN(Number(storedUrlItem.time))
		) {
			return defaultPresignedUrl
		}

		const now = Date.now()
		if (Number(storedUrlItem.time) - now - PRESIGNED_FETCH_OFFSET <= 0) {
			return defaultPresignedUrl
		}

		return storedUrlItem.url
	} catch (error) {
		console.info(error)
		return defaultPresignedUrl
	}
}

function setStoredPresignedUrl({
	episode,
	story,
	time,
	url,
}: TComputePresignedUrlIdParams & TLocallyStoredPresignedUrlItem) {
	if (!url) {
		return
	}
	const storeItem: TLocallyStoredPresignedUrlItem = {
		time,
		url,
	}
	const key = computePresignedUrlsId({ episode, story })

	localStorage.setItem(key, JSON.stringify(storeItem))
}
export default function useTextSaving() {
	const { mutateAsync: getPresignedUrl } = usePresignedUrlMutation()
	const { mutateAsync: updatePresignedUrl } = useUpdatePresignedUrlMutation()
	const { data: episodeData } = useEpisodeContent()
	const { handleSavingResponse } = useHandleSavingResponse()

	async function saveText({
		content,
		withLocalStorage = false,
	}: {
		content: string
		withLocalStorage?: boolean
	}) {
		if (!episodeData?.chapter) {
			return false
		}
		const chapter_id = episodeData.chapter.id
		const project_id = episodeData.chapter.project
		let presignedUrl = ''
		if (withLocalStorage) {
			presignedUrl = getStoredPresignedUrl({
				episode: String(chapter_id),
				story: String(project_id),
			})
		}

		if (!presignedUrl) {
			const beforeReq = Date.now()
			const presignedResp = await getPresignedUrl({
				chapter_id,
				project_id,
				expiration_minutes: DEFAULT_TTL,
				content_type: 'text/plain',
			})
			handleSavingResponse({
				response: presignedResp,
				seq_no: episodeData.chapter.seq_number,
			})
			presignedUrl = presignedResp?.data?.presigned_url || ''
			const reqDuration = Date.now() - beforeReq
			if (withLocalStorage) {
				setStoredPresignedUrl({
					time: Date.now() + DEFAULT_TTL * 60 * 1000 - reqDuration, // time when this expires,
					url: presignedUrl,
					episode: String(chapter_id),
					story: String(project_id),
				})
			}
		}

		if (presignedUrl) {
			const resp = await updatePresignedUrl({
				presignedUrl,
				content,
			})

			if (resp) {
				return true
			}
			Sentry.captureMessage('Pre-Signed Saving Failed', {
				level: 'warning',
				extra: {
					presignedUrl,
					chapter_id,
					project_id,
					content: content.slice(0, 100),
				},
			})
		}

		const resp = await saveContent({
			episodeId: episodeData.chapter?.parent || chapter_id,
			projectId: project_id,
			id: chapter_id,
			text: content,
		})
		handleSavingResponse({
			response: resp,
			seq_no: episodeData.chapter.seq_number,
		})
		return resp.success
	}

	const mutation = useMutation({
		mutationFn: saveText,
	})

	return mutation
}

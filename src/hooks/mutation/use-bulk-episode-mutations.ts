import { useParams } from 'next/navigation'
import { API_URLS } from '@/constants/global-constants'
import { BULK_EP_DOWNLOAD_MUTATION_KEY } from '@/constants/query-constants'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

import useEpisodeTableContext from '@/providers/episode-table-provider'
import { fetchAPI } from '@/lib/fetch-api'
import { downloadFile, downloadFileAsync } from '@/lib/utils/client-helpers'
import { getFilenameForSeqNos } from '@/lib/utils/helpers'

import {
	TDownloadBulkEpisodeBodyParams,
	TDownloadBulkEpisodeResponse,
	TDownloadBulkEpisodeUrlParams,
} from '@/types/episode-type'

export default function useBulkEpisodeMutations() {
	const { id } = useParams()

	const { initialStoryData } = useEpisodeTableContext()

	async function downloadBulkEpisodes({
		selectedEpisodes,
		separate,
	}: {
		selectedEpisodes: { chapter_title: string; seq_number: number }[]
		separate: boolean
	}) {
		if (selectedEpisodes.length < 1) {
			toast.error('Select at least 1 Episode!')
			return
		}
		const seq_nos = selectedEpisodes.map((item) => item.seq_number)
		const resp = await fetchAPI<
			TDownloadBulkEpisodeResponse,
			TDownloadBulkEpisodeUrlParams,
			TDownloadBulkEpisodeBodyParams
		>({
			method: 'POST',
			url: API_URLS.BULK_EPISODE_DOWNLOAD,
			body: {
				separate,
				seq_nos,
			},
			urlParams: {
				projectId: String(id),
			},
		})
		if (
			!(
				resp.data?.file_urls &&
				Array.isArray(resp.data?.file_urls) &&
				resp.data?.file_urls.length > 0
			)
		) {
			toast.error('Error in downloading episodes!')
			return
		}

		toast.info('Download started!')

		if (separate) {
			const maxDownloads = Math.min(
				resp.data.file_urls.length,
				selectedEpisodes.length
			)

			const downloadPromises: Promise<{
				filename: string
				success: boolean
			}>[] = []

			for (let idx = 0; idx < maxDownloads; idx++) {
				const url = resp.data.file_urls[idx]
				const filename = (selectedEpisodes[idx]?.chapter_title ?? '') + '.docx'

				const downloadPromise = downloadFileAsync(url, filename)
					.then(() => ({ filename, success: true }))
					.catch((error) => {
						console.error(`Failed to download ${filename}:`, error)
						toast.error(`Failed to download ${filename}`)
						return { filename, success: false }
					})

				downloadPromises.push(downloadPromise)
			}

			const results = await Promise.allSettled(downloadPromises)
			const successfulDownloads = results.filter(
				(result) => result.status === 'fulfilled' && result.value.success
			).length
			const failedDownloads = maxDownloads - successfulDownloads

			if (successfulDownloads > 0) {
				toast.success(`Downloaded ${successfulDownloads} file(s) successfully!`)
			}

			if (failedDownloads > 0 && successfulDownloads === 0) {
				toast.error(`Failed to download all ${failedDownloads} file(s)!`)
			}
		} else {
			const filename =
				initialStoryData?.project_title + ' - ' + getFilenameForSeqNos(seq_nos)
			downloadFile(resp.data.file_urls[0], filename)
			toast.success('Download completed!')
		}
	}

	const downloadBulkMutation = useMutation({
		mutationKey: [BULK_EP_DOWNLOAD_MUTATION_KEY],
		mutationFn: downloadBulkEpisodes,
	})

	return { downloadBulkMutation }
}

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
				resp.data?.file_url &&
				Array.isArray(resp.data?.file_url) &&
				resp.data?.file_url.length > 0
			)
		) {
			toast.error('Error in downloading episodes!')
			return
		}

		toast.info('Download started!')

		if (separate) {
			const maxDownloads = Math.min(
				resp.data.file_url.length,
				selectedEpisodes.length
			)

			// Create download promises for proper completion tracking
			const downloadPromises: Promise<void>[] = []

			for (let idx = 0; idx < maxDownloads; idx++) {
				const url = resp.data.file_url[idx]
				const filename = (selectedEpisodes[idx]?.chapter_title ?? '') + '.docx'

				const downloadPromise = downloadFileAsync(url, filename).catch(
					(error) => {
						console.error(`Failed to download ${filename}:`, error)
						toast.error(`Failed to download ${filename}`)
					}
				)

				downloadPromises.push(downloadPromise)
			}

			await Promise.allSettled(downloadPromises)
			toast.success(`Downloaded ${maxDownloads} file(s) successfully!`)
		} else {
			const filename =
				initialStoryData?.project_title + ' - ' + getFilenameForSeqNos(seq_nos)
			downloadFile(resp.data.file_url[0], filename)
			toast.success('Download completed!')
		}
	}

	const downloadBulkMutation = useMutation({
		mutationKey: [BULK_EP_DOWNLOAD_MUTATION_KEY],
		mutationFn: downloadBulkEpisodes,
	})

	return { downloadBulkMutation }
}

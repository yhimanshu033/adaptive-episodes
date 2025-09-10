import { useParams } from 'next/navigation'
import { BULK_EP_DOWNLOAD_MUTATION_KEY } from '@/constants/query-constants'
import { getBulkEpisodeDownloadUrls } from '@/server-action/episode-action'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

import useEpisodeTableContext from '@/providers/episode-table-provider'
import { downloadFile, downloadFileAsync } from '@/lib/utils/client-helpers'
import { getFilenameForSeqNos } from '@/lib/utils/helpers'

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
		let fileUrls
		try {
			fileUrls = await getBulkEpisodeDownloadUrls(String(id), {
				separate,
				seq_nos: selectedEpisodes.map((item) => item.seq_number),
			})
		} catch (error: unknown) {
			console.error('Error fetching bulk episode download URLs:', error)
			toast.error(
				error instanceof Error
					? error.message
					: 'Error in downloading episodes!'
			)
			return
		}

		if (!fileUrls || !fileUrls.length) {
			toast.error('Error in downloading episodes!')
			return
		}
		if (!(fileUrls && Array.isArray(fileUrls) && fileUrls.length > 0)) {
			toast.error('Error in downloading episodes!')
			return
		}

		toast.info('Download started!')

		if (separate) {
			const maxDownloads = Math.min(fileUrls.length, selectedEpisodes.length)

			const downloadPromises: Promise<{
				filename: string
				success: boolean
			}>[] = []

			for (let idx = 0; idx < maxDownloads; idx++) {
				const url = fileUrls[idx]
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
				initialStoryData?.project_title +
				' - ' +
				getFilenameForSeqNos(selectedEpisodes.map((item) => item.seq_number))
			downloadFile(fileUrls[0], filename)
			toast.success('Download completed!')
		}
	}

	const downloadBulkMutation = useMutation({
		mutationKey: [BULK_EP_DOWNLOAD_MUTATION_KEY],
		mutationFn: downloadBulkEpisodes,
	})

	return {
		downloadBulkMutation,
	}
}

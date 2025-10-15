import { useParams } from 'next/navigation'
import { ACTION, EVENT_TYPE, SCREEN_NAME } from '@/constants/analytics'
import { BULK_EP_DOWNLOAD_MUTATION_KEY } from '@/constants/query-constants'
import { getBulkEpisodeDownloadUrls } from '@/server-action/episode-action'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

import useEpisodeTableContext from '@/providers/episode-table-provider'
import { track } from '@/lib/utils/analytics'
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

		track({
			event: EVENT_TYPE.BUTTON_CLICK,
			screenName: SCREEN_NAME.EPISODE_LIST,
			metaData: {
				action: ACTION.DOWNLOAD_BULK_EPISODES,
				separate,
				size: selectedEpisodes.length,
			},
		})
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
			let successfulDownloads = 0
			for (let idx = 0; idx < maxDownloads; idx++) {
				const url = fileUrls[idx]
				const filename = (selectedEpisodes[idx]?.chapter_title ?? '') + '.docx'
				try {
					await downloadFileAsync(url, filename)
					toast.success(
						`Download started for chapter ${selectedEpisodes[idx]?.seq_number}`
					)
					successfulDownloads++
				} catch {
					toast.error(
						`Download failed for chapter ${selectedEpisodes[idx]?.seq_number}`
					)
				}
			}
			toast.success(`Download started for ${successfulDownloads} chapters `)
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

import { useParams } from 'next/navigation'
import { API_URLS } from '@/constants/global-constants'
import {
	BULK_EP_DOWNLOAD_MUTATION_KEY,
	BULK_EP_DOWNLOAD_URL_MUTATION_KEY,
} from '@/constants/query-constants'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

import useEpisodeTableContext from '@/providers/episode-table-provider'
import { fetchAPI } from '@/lib/fetch-api'
import { downloadFile } from '@/lib/utils/client-helpers'
import { getFilenameForSeqNos } from '@/lib/utils/helpers'

import {
	TDownloadBulkEpisodeBodyParams,
	TDownloadBulkEpisodeResponse,
	TDownloadBulkEpisodeUrlParams,
} from '@/types/episode-type'

export default function useBulkEpisodeMutations() {
	const { id } = useParams()

	const { initialStoryData } = useEpisodeTableContext()

	async function getBulkEpisodeDownloadUrl(
		body: TDownloadBulkEpisodeBodyParams
	) {
		if (body.seq_nos.length < 1) {
			toast.error('Select at least 1 Episode!')
			return
		}
		const resp = await fetchAPI<
			TDownloadBulkEpisodeResponse,
			TDownloadBulkEpisodeUrlParams,
			TDownloadBulkEpisodeBodyParams
		>({
			method: 'POST',
			url: API_URLS.BULK_EPISODE_DOWNLOAD,
			body,
			urlParams: {
				projectId: String(id),
			},
		})
		return resp.data?.file_url
	}

	async function downloadBulkEpisodes(body: TDownloadBulkEpisodeBodyParams) {
		const fileUrl = await getBulkEpisodeDownloadUrl(body)
		if (!fileUrl) {
			toast.error('Error in downloading episodes!')
			return
		}

		toast.info('Download started!')
		const fileName =
			initialStoryData?.project_title +
			' - ' +
			getFilenameForSeqNos(body.seq_nos)
		downloadFile(fileUrl, fileName)
	}

	const downloadBulkMutation = useMutation({
		mutationKey: [BULK_EP_DOWNLOAD_MUTATION_KEY],
		mutationFn: downloadBulkEpisodes,
	})

	const getDownloadBulkUrlMutation = useMutation({
		mutationKey: [BULK_EP_DOWNLOAD_URL_MUTATION_KEY],
		mutationFn: getBulkEpisodeDownloadUrl,
	})

	return { downloadBulkMutation, getDownloadBulkUrlMutation }
}

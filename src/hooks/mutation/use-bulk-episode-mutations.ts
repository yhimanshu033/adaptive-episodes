import { useParams } from 'next/navigation'
import { API_URLS } from '@/constants/global-constants'
import { BULK_EP_DOWNLOAD_MUTATION_KEY } from '@/constants/query-constants'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

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

	async function downloadBulkEpisodes(body: TDownloadBulkEpisodeBodyParams) {
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
		if (!resp.data?.file_url) {
			toast.error('Error in downloading episodes!')
			return
		}

		toast.info('Download started!')
		downloadFile(resp.data?.file_url, getFilenameForSeqNos(body.seq_nos))
	}

	const downloadBulkMutation = useMutation({
		mutationKey: [BULK_EP_DOWNLOAD_MUTATION_KEY],
		mutationFn: downloadBulkEpisodes,
	})

	return { downloadBulkMutation }
}

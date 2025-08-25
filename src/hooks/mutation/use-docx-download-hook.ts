import useBulkEpisodeDownloadQuery from '@/hooks/query/use-bulk-episode-download-query'
import useDocxDownloadParams from '@/hooks/use-docx-download-params'
import useEnableDocx from '@/hooks/use-enable-docx'
import useIsGerman from '@/hooks/use-is-german'
import { useMutation, useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'

import { downloadFile } from '@/lib/utils/client-helpers'
import { getFileSizeFromURL, getFormattedDate } from '@/lib/utils/helpers'

export default function useDocxDownloadHook() {
	const { epNumber, projectTitle, title } = useDocxDownloadParams()
	const { downloadDocxEnabled, seq_nos } = useEnableDocx()
	const { data, text } = useBulkEpisodeDownloadQuery({ seq_nos })

	const isGerman = useIsGerman()

	const { data: fileSize } = useQuery({
		queryKey: ['docx-actual-file-size', data],
		queryFn: async () => {
			if (!data) {
				toast.error("Couldn't calculate file size!")
				return
			}
			return await getFileSizeFromURL(data, text)
		},
		enabled: !!data && downloadDocxEnabled,
		retry: 1,
	})

	// eslint-disable-next-line @typescript-eslint/require-await
	async function downloadDocx() {
		if (!data) {
			toast.error("Couldn't download docx!")
			return
		}
		downloadFile(
			data,
			`${projectTitle} - Ep ${epNumber} - ${title} - ${getFormattedDate()}.docx`
		)
	}

	const mutation = useMutation({
		mutationKey: ['download-docx'],
		mutationFn: downloadDocx,
	})

	return {
		showButton: downloadDocxEnabled || !isGerman,
		title,
		projectTitle,
		epNumber,
		fileSize,
		isEnabled: !!data || !isGerman,
		...mutation,
	}
}

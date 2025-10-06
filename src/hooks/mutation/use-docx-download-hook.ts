import { useParams } from 'next/navigation'
import useDocxDownloadParams from '@/hooks/use-docx-download-params'
import useEnableDocx from '@/hooks/use-enable-docx'
import useIsGerman from '@/hooks/use-is-german'
import { getBulkEpisodeDownloadUrls } from '@/server-action/episode-action'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

import { downloadFileAsync } from '@/lib/utils/client-helpers'
import { getFormattedDate } from '@/lib/utils/helpers'

import useLanguage from '../use-language'

export default function useDocxDownloadHook() {
	const { id } = useParams()
	const language = useLanguage()
	const { epNumber, projectTitle, title } = useDocxDownloadParams()
	const { downloadDocxEnabled, seq_nos } = useEnableDocx()

	const isGerman = useIsGerman()

	// eslint-disable-next-line @typescript-eslint/require-await
	async function downloadDocx() {
		const data = await getBulkEpisodeDownloadUrls(String(id), {
			seq_nos,
			language,
			separate: false,
		})
		if (!data) {
			toast.error("Couldn't download docx!")
			return
		}
		await downloadFileAsync(
			data[0],
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
		...mutation,
	}
}

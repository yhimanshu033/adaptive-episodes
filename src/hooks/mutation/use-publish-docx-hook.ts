import { useGDrivePushMutation } from '@/hooks/mutation/use-gdrive-hook'
import useDocxHtml from '@/hooks/mutation/use-get-docx-hook'
import { useMutation } from '@tanstack/react-query'

import { getFormattedDate } from '@/lib/utils/helpers'

import { DownloadDocxParams } from '@/types/episode-type'

export default function usePublishDocxHook({
	latestStatus,
}: DownloadDocxParams) {
	const {
		mutateAsync: getDocxHtml,
		showButton,
		epNumber,
		projectTitle,
	} = useDocxHtml({ latestStatus })
	const { mutateAsync: pushToGDrive } = useGDrivePushMutation()

	async function downloadDocx() {
		const { base64String, title } = await getDocxHtml()
		const date = getFormattedDate()
		await pushToGDrive({
			file_name: `${projectTitle.toUpperCase()} Episode ${epNumber} ${title} ${date}.docx`,
			html_content: base64String,
		})
	}

	const mutation = useMutation({
		mutationKey: ['download-docx'],
		mutationFn: downloadDocx,
	})

	return { showButton, ...mutation }
}

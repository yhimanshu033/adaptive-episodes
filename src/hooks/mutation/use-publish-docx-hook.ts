import { useParams } from 'next/navigation'
import { useGDrivePushMutation } from '@/hooks/mutation/use-gdrive-hook'
import useDocxHtml from '@/hooks/mutation/use-get-docx-hook'
import { useMutation } from '@tanstack/react-query'

import { DownloadDocxParams } from '@/types/episode-type'

export default function usePublishDocxHook({
	latestStatus,
}: DownloadDocxParams) {
	const { episodeId } = useParams()
	const { mutateAsync: getDocxHtml, showButton } = useDocxHtml({ latestStatus })
	const { mutateAsync: pushToGDrive } = useGDrivePushMutation()

	async function downloadDocx({ fileName }: { fileName: string }) {
		const { base64String } = await getDocxHtml()
		await pushToGDrive({
			file_name: `${fileName}.docx`,
			html_content: base64String,
			chapter_id: Number(episodeId),
		})
	}

	const mutation = useMutation({
		mutationKey: ['download-docx'],
		mutationFn: downloadDocx,
	})

	return { showButton, ...mutation }
}

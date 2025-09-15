import { useParams } from 'next/navigation'
import { useGDrivePushMutation } from '@/hooks/mutation/use-gdrive-hook'
import useDocxHtml from '@/hooks/query/use-get-docx-hook'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

export default function usePublishDocxHook() {
	const { episodeId } = useParams()
	const { data } = useDocxHtml()
	const { mutateAsync: pushToGDrive } = useGDrivePushMutation()

	async function uploadDocx({ fileName }: { fileName: string }) {
		if (!data) {
			toast.error("Couldn't generate docx!")
			return
		}
		const { base64String } = data
		await pushToGDrive({
			file_name: `${fileName}.docx`,
			html_content: base64String,
			chapter_id: Number(episodeId),
		})
	}

	const mutation = useMutation({
		mutationKey: ['upload-docx'],
		mutationFn: uploadDocx,
	})

	return mutation
}

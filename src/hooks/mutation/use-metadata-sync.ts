import { EpisodeActions } from '@/constants/episodes-constants'
import useSocket from '@/hooks/use-socket'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

export default function useMetadataSyncMutation(chapterId?: number) {
	const { startTask, getResponse } = useSocket()

	const onMetadataSync = async () => {
		if (!chapterId) {
			toast.error('Could not find chapter for metadata sync!')
			return
		}
		const taskId = await startTask({
			method: 'PATCH',
			url: '/chapters/:chapterId/sync_metadata',
			urlParams: {
				chapterId,
			},
		})
		toast.success('Metadata sync started!')
		const resp = await getResponse(taskId)
		toast.success('Metadata sync completed!')
		return resp
	}

	const metadataSyncMutation = useMutation({
		mutationKey: [EpisodeActions.METATDATA, chapterId],
		mutationFn: onMetadataSync,
	})

	return metadataSyncMutation
}

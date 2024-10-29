import { useParams } from 'next/navigation'
import { saveContent } from '@/server-action/content-action'
import { useMutation } from '@tanstack/react-query'

const useEpisodeHook = () => {
	const { id, episodeId } = useParams()

	const onSaveEpisode = (content: string) => {
		return saveContent({
			storyId: id as string,
			episodeId: episodeId as string,
			content,
		})
	}

	const saveEpisodeMutation = useMutation({
		mutationKey: ['save', episodeId],
		mutationFn: onSaveEpisode,
	})

	return { saveEpisodeMutation }
}

export default useEpisodeHook

import { useParams } from 'next/navigation'
import { getEpisodeVersions } from '@/server-action/version-action'
import { useQuery } from '@tanstack/react-query'

const useVersionData = () => {
	const { id, episodeId } = useParams()

	const query = useQuery({
		queryKey: ['versions', id, episodeId],
		queryFn: () =>
			getEpisodeVersions({
				storyId: id as string,
				episodeId: episodeId as string,
			}),
	})
	return query
}

export default useVersionData

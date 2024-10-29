import { useParams } from 'next/navigation'
import { getEpisodes } from '@/server-action/episode-action'
import { useQuery } from '@tanstack/react-query'

export const useEpisodesData = (page?: number, episodeFilter?: string) => {
	const { id } = useParams()
	const query = useQuery({
		queryKey: [id, 'episodes', page, episodeFilter],
		queryFn: () => getEpisodes(id as string, page, episodeFilter),
		refetchOnMount: false,
		refetchOnWindowFocus: false,
	})
	return query
}

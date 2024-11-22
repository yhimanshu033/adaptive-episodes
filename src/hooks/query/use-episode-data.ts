import { useParams } from 'next/navigation'
import { getEpisodes } from '@/server-action/episode-action'
import { useQuery } from '@tanstack/react-query'

export const useEpisodesData = (title: string = '', page: number = 1) => {
	const { id } = useParams()
	const storyId = parseInt(id as string)
	const query = useQuery({
		queryKey: [storyId, 'episodes', page, title],
		queryFn: () => getEpisodes(storyId, page, title),
	})

	return query
}

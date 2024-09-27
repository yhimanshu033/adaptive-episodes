'use client'

import { useParams } from 'next/navigation'
import { getEpisodeContent } from '@/server-action/content-action'
import { useQuery } from '@tanstack/react-query'

export const useEpisodeContent = () => {
	const { id, episodeId }: { episodeId: string; id: string } = useParams()
	const query = useQuery({
		queryKey: [id, episodeId, 'content'],
		queryFn: () => getEpisodeContent(id, episodeId),
	})

	return query
}

export default useEpisodeContent

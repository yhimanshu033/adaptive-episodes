'use client'

import { useParams } from 'next/navigation'
import { getEpisodeContent } from '@/server-action/content-action'
import { useQuery } from '@tanstack/react-query'

export const useEpisodeContent = () => {
	const { episodeId }: { episodeId: string } = useParams()
	const query = useQuery({
		queryKey: [episodeId, 'content'],
		queryFn: () => getEpisodeContent(parseInt(episodeId)),
		refetchOnMount: false,
		refetchOnWindowFocus: false,
		gcTime: 0,
	})

	return query
}

export default useEpisodeContent

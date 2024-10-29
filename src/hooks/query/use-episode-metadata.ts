'use client'

import { useParams } from 'next/navigation'
import { getMetadata } from '@/server-action/metadata-action'
import { useQuery } from '@tanstack/react-query'

const useEpisodeMetadata = (start: number, end: number) => {
	const { id }: { episodeId: string; id: string } = useParams()
	const query = useQuery({
		queryKey: ['metadata', id, start, end],
		queryFn: () => getMetadata(id, start, end),
		enabled: false,
		refetchOnMount: false,
		refetchOnWindowFocus: false,
	})
	return query
}

export default useEpisodeMetadata

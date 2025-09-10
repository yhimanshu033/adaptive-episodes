'use client'

import { useParams } from 'next/navigation'
import { EPISODE_INFO_MUTATION_KEY } from '@/constants/query-constants'
import { getEpisodeContent } from '@/server-action/content-action'
import { useMutation } from '@tanstack/react-query'

export const useEpisodeContentMutation = (episodeId: number) => {
	const { id }: { id: string } = useParams()

	const query = useMutation({
		mutationKey: [EPISODE_INFO_MUTATION_KEY, episodeId, id],
		mutationFn: () => getEpisodeContent(episodeId),
	})

	return query
}

export default useEpisodeContentMutation

'use client'

import { useParams } from 'next/navigation'
import { getLoglines } from '@/server-action/episode-action'
import { useQuery } from '@tanstack/react-query'

const useLoglineData = (start: string, end: string) => {
	const { id }: { id: string } = useParams()
	const query = useQuery({
		queryKey: ['logline'],
		queryFn: () => getLoglines(id, start, end),
	})
	return query
}

export default useLoglineData

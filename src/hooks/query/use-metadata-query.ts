import { useParams } from 'next/navigation'
import { getMetadata } from '@/server-action/metadata-action'
import { useQuery } from '@tanstack/react-query'

export default function useMetadataQuery(start: number, end: number) {
	const { id } = useParams()

	const query = useQuery({
		queryKey: ['metadata', id, start, end],
		queryFn: () => getMetadata(Number(id), Math.max(start - 1, 1), end),
		staleTime: Infinity,
	})

	return query
}

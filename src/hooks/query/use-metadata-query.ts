import { useParams } from 'next/navigation'
import { METADATA_QUERY_KEY } from '@/constants/query-constants'
import useLanguage from '@/hooks/use-language'
import { getMetadata } from '@/server-action/metadata-action'
import { useQuery } from '@tanstack/react-query'

export default function useMetadataQuery(start: number, end: number) {
	const { id } = useParams()
	const language = useLanguage()

	const query = useQuery({
		queryKey: [METADATA_QUERY_KEY, id, start, end],
		queryFn: () => getMetadata(Number(id), start, end, language),
		staleTime: Infinity,
	})

	return query
}

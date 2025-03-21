import { useParams } from 'next/navigation'
import { NOTES_QUERY_KEY } from '@/constants/query-constants'
import { getNotes } from '@/server-action/episode-action'
import { useQuery } from '@tanstack/react-query'

export const useNotesData = () => {
	const { id } = useParams()
	const query = useQuery({
		queryKey: [NOTES_QUERY_KEY, Number(id)],
		queryFn: () => getNotes(Number(id)),
		gcTime: 0,
	})
	return query
}

'ue client'

import { useParams } from 'next/navigation'
import { USER_LIST_QUERY_KEY } from '@/constants/query-constants'
import { getMembers } from '@/server-action/user-action'
import { useQuery } from '@tanstack/react-query'

export default function useUserMembersQuery() {
	const { id } = useParams()

	const query = useQuery({
		queryKey: [USER_LIST_QUERY_KEY, id],
		queryFn: () => getMembers(id as string),
	})

	return query
}

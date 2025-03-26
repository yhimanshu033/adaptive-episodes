import { ALL_USERS_QUERY_KEY } from '@/constants/query-constants'
import { getAllUsers } from '@/server-action/user-action'
import { useQuery } from '@tanstack/react-query'

const useAllUsersData = (searchQuery: string) => {
	const query = useQuery({
		queryKey: [ALL_USERS_QUERY_KEY, searchQuery],
		queryFn: () => getAllUsers(searchQuery),
	})
	return query
}

export default useAllUsersData

import { USER_PROJECTS_QUERY_KEY } from '@/constants/query-constants'
import { getUserProjects } from '@/server-action/user-action'
import { useQuery } from '@tanstack/react-query'

const useUserProjects = () => {
	const query = useQuery({
		queryKey: [USER_PROJECTS_QUERY_KEY],
		queryFn: getUserProjects,
	})

	return query
}
export default useUserProjects

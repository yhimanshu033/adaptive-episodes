import { useMemo } from 'react'
import { useParams } from 'next/navigation'

import { ERole } from '@/types/admin-types'

import useUserProjects from './query/use-user-projects'

const useAdmin = () => {
	const { data: projects } = useUserProjects()
	const { id } = useParams()

	const isAdmin = useMemo(() => {
		return projects
			? projects.find(
					(project) =>
						project.project.id === Number(id) && project.role === ERole.ADMIN
				)
			: false
	}, [id, projects])

	return { isAdmin }
}

export default useAdmin

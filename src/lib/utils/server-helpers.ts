import { NextRequest } from 'next/server'
import { API_URLS } from '@/constants/global-constants'
import { MANAGE_PROJECT } from '@/constants/route-constants'

import { ERole, SessionData, UserProject } from '@/types/admin-types'

export async function projectAdminCheck(
	req: NextRequest,
	session: SessionData
) {
	let data: { projects: UserProject[] } | null = null
	try {
		data = (await fetch(
			`${process.env.NEXT_PUBLIC_BACKEND_URL}${API_URLS.GET_USER_PROJECTS}`,
			{
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${session.accessToken}`,
				},
			}
		).then((res) => res.json())) as { projects: UserProject[] }
	} catch (error) {
		console.error('Error fetching user projects:', error)
	}
	const projectId = req.nextUrl.pathname.match(MANAGE_PROJECT)?.[1] || null
	return data && projectId
		? data?.projects?.some(
				(project) =>
					project.project.id === Number(projectId) &&
					project.role === ERole.ADMIN
			)
		: false
}

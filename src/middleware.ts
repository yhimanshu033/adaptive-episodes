import { NextRequest, NextResponse } from 'next/server'
import {
	AUTH,
	DASHBOARD,
	MANAGE_PROJECT,
	PROTECTED_ROUTES,
} from '@/constants/route-constants'
import { getToken, JWT } from 'next-auth/jwt'

import { API_URLS } from './constants/global-constants'
import { ERole, UserProject } from './types/admin-types'

const handleUIRoutes = async (req: NextRequest, jwt: JWT | null) => {
	const auth = req.nextUrl.clone()
	auth.pathname = AUTH
	const afterAuth = req.nextUrl.clone()
	afterAuth.pathname = DASHBOARD

	if (PROTECTED_ROUTES.test(req.nextUrl.pathname) && !jwt) {
		return NextResponse.redirect(auth)
	}
	if (!!req.nextUrl.pathname.startsWith(AUTH) && jwt) {
		return NextResponse.redirect(afterAuth)
	}

	if (MANAGE_PROJECT.test(req.nextUrl.pathname) && jwt) {
		const data = (await fetch(
			`${process.env.NEXT_PUBLIC_BACKEND_URL}${API_URLS.GET_USER_PROJECTS}`,
			{
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${jwt.accessToken}`,
				},
			}
		).then((res) => res.json())) as { projects: UserProject[] }
		const projectId = req.nextUrl.pathname.match(MANAGE_PROJECT)?.[1] || null
		const isAdmin =
			data && projectId
				? data?.projects?.some(
						(project) =>
							project.project.id === Number(projectId) &&
							project.role === ERole.ADMIN
					)
				: false
		if (isAdmin) return NextResponse.next()
		return NextResponse.redirect(afterAuth)
	}
}

export async function middleware(req: NextRequest) {
	const jwt = await getToken({
		req,
		secret: process.env.NEXTAUTH_SECRET,
	})
	return handleUIRoutes(req, jwt)
}

export const config = {
	matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}

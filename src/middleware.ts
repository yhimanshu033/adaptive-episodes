import { NextRequest, NextResponse } from 'next/server'
import {
	AUTH,
	DASHBOARD,
	MANAGE_PROJECT,
	PROTECTED_ROUTES,
} from '@/constants/route-constants'
import { getToken } from 'next-auth/jwt'

import { projectAdminCheck } from '@/lib/utils/server-helpers'

import { SessionData } from '@/types/admin-types'

const handleUIRoutes = async (
	req: NextRequest,
	session: SessionData | null
) => {
	const auth = req.nextUrl.clone()
	auth.pathname = AUTH
	const afterAuth = req.nextUrl.clone()
	afterAuth.pathname = DASHBOARD

	if (PROTECTED_ROUTES.test(req.nextUrl.pathname) && !session?.accessToken) {
		return NextResponse.redirect(auth)
	}
	if (!!req.nextUrl.pathname.startsWith(AUTH) && session?.accessToken) {
		return NextResponse.redirect(afterAuth)
	}

	if (MANAGE_PROJECT.test(req.nextUrl.pathname) && session?.accessToken) {
		const isAdmin = await projectAdminCheck(req, session)
		if (isAdmin) {
			return NextResponse.next()
		}
		return NextResponse.redirect(afterAuth)
	}
}

export async function middleware(req: NextRequest) {
	const jwt = await getToken({
		req,
		secret: process.env.NEXTAUTH_SECRET,
	})
	return handleUIRoutes(req, jwt as unknown as SessionData)
}

export const config = {
	matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}

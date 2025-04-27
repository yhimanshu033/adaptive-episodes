import { NextRequest, NextResponse } from 'next/server'
import {
	AUTH,
	DASHBOARD,
	MANAGE_PROJECT,
	PROTECTED_ROUTES,
} from '@/constants/route-constants'
import { getToken, JWT } from 'next-auth/jwt'

import { projectAdminCheck } from '@/lib/utils/helpers'

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
		const isAdmin = await projectAdminCheck(req, jwt)
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
	return handleUIRoutes(req, jwt)
}

export const config = {
	matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}

import { NextRequest, NextResponse } from 'next/server'
import { AUTH, DASHBOARD, PROTECTED_ROUTES } from '@/constants/route-constants'
import { Session } from 'next-auth'
import { getToken } from 'next-auth/jwt'

const handleUIRoutes = (req: NextRequest, session: Session) => {
	const auth = req.nextUrl.clone()
	auth.pathname = AUTH
	const afterAuth = req.nextUrl.clone()
	afterAuth.pathname = DASHBOARD

	if (PROTECTED_ROUTES.test(req.nextUrl.pathname) && !session) {
		return NextResponse.redirect(auth)
	}
	if (!!req.nextUrl.pathname.startsWith(AUTH) && session) {
		return NextResponse.redirect(afterAuth)
	}

	return NextResponse.next()
}

export async function middleware(req: NextRequest) {
	const session = await getToken({
		req,
		secret: process.env.NEXTAUTH_SECRET,
	})

	return handleUIRoutes(req, session as unknown as Session)
}

export const config = {
	matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}

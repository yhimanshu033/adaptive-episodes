import { NextRequest, NextResponse } from 'next/server'

import { DEMO_AUTH_COOKIE, SIGNIN_ROUTE, STORIES_ROUTE } from '@/lib/demo-auth'

export function middleware(req: NextRequest) {
	const { pathname } = req.nextUrl
	const cookieName: string = DEMO_AUTH_COOKIE
	const homeRoute = '/' as const
	const signinRoute: string = SIGNIN_ROUTE
	const storiesRoute: string = STORIES_ROUTE
	const storyRoute = '/story'

	const isAuthed = Boolean(req.cookies.get(cookieName)?.value)

	// If user is already authenticated, don't let them visit /signin
	if (pathname.startsWith(signinRoute) && isAuthed) {
		const redirectUrl = req.nextUrl.clone()
		redirectUrl.pathname = homeRoute
		return NextResponse.redirect(redirectUrl)
	}

	// If user isn't authenticated, protect /
	if (pathname === homeRoute && !isAuthed) {
		const redirectUrl = req.nextUrl.clone()
		redirectUrl.pathname = signinRoute
		return NextResponse.redirect(redirectUrl)
	}

	// If user isn't authenticated, protect /stories
	if (pathname.startsWith(storiesRoute) && !isAuthed) {
		const redirectUrl = req.nextUrl.clone()
		redirectUrl.pathname = signinRoute
		return NextResponse.redirect(redirectUrl)
	}

	// If user isn't authenticated, protect /story/:id
	if (pathname.startsWith(storyRoute) && !isAuthed) {
		const redirectUrl = req.nextUrl.clone()
		redirectUrl.pathname = signinRoute
		return NextResponse.redirect(redirectUrl)
	}

	return NextResponse.next()
}

export const config = {
	matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}

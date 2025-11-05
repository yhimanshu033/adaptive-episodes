'use client'

import React, { useEffect } from 'react'
import { useSessionStore } from '@/store/session-store'
import { Session } from 'next-auth'

export function SessionProviderSync({
	children,
	session,
}: React.PropsWithChildren & { session: Session | null }) {
	const setSession = useSessionStore((s) => s.setSession)

	useEffect(() => {
		setSession(session ?? null)
	}, [session, setSession])

	return <>{children}</>
}

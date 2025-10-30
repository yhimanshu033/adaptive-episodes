import { useSessionStore } from '@/store/session-store'
import { getServerSession } from 'next-auth'
import { getSession } from 'next-auth/react'

export async function getUserSession() {
	if (typeof window === 'undefined') {
		return getServerSession()
	}
	const storedSession = useSessionStore.getState().session
	if (storedSession) {
		return storedSession
	}
	return getSession()
}

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import {
	clearDemoAuthCookie,
	DEMO_AUTH_STORAGE_SESSION_EMAIL_KEY,
	DEMO_AUTH_STORAGE_USERS_KEY,
	safeJsonParse,
	setDemoAuthCookie,
} from '@/lib/demo-auth'

export type DemoAuthUser = {
	dob: string
	email: string
	fullName: string // ISO date string (YYYY-MM-DD)
	password: string
}

export type DemoAuthSessionUser = Omit<DemoAuthUser, 'password'>

type DemoAuthState = {
	isAuthenticated: boolean
	signIn: (data: {
		email: string
		password: string
	}) => { ok: true } | { error: string; ok: false }
	signOut: () => void
	signUp: (data: DemoAuthUser) => { ok: true } | { error: string; ok: false }
	user: DemoAuthSessionUser | null
	users: DemoAuthUser[]
}

export const useDemoAuthStore = create<DemoAuthState>()(
	persist(
		(set, get) => ({
			isAuthenticated: false,
			user: null,
			users: [],
			signUp: (data) => {
				const existing = get().users.find(
					(u) => u.email.toLowerCase() === data.email.toLowerCase()
				)
				if (existing) {
					return {
						ok: false,
						error: 'An account with this email already exists.',
					}
				}

				const nextUsers = [...get().users, data]
				const sessionUser: DemoAuthSessionUser = {
					fullName: data.fullName,
					email: data.email,
					dob: data.dob,
				}

				setDemoAuthCookie(data.email)
				if (typeof localStorage !== 'undefined') {
					localStorage.setItem(DEMO_AUTH_STORAGE_SESSION_EMAIL_KEY, data.email)
				}

				set({
					users: nextUsers,
					user: sessionUser,
					isAuthenticated: true,
				})

				return { ok: true }
			},
			signIn: ({ email, password }) => {
				const match = get().users.find(
					(u) =>
						u.email.toLowerCase() === email.toLowerCase() &&
						u.password === password
				)

				if (!match) {
					return { ok: false, error: 'Invalid email or password.' }
				}

				const sessionUser: DemoAuthSessionUser = {
					fullName: match.fullName,
					email: match.email,
					dob: match.dob,
				}

				setDemoAuthCookie(match.email)
				if (typeof localStorage !== 'undefined') {
					localStorage.setItem(DEMO_AUTH_STORAGE_SESSION_EMAIL_KEY, match.email)
				}

				set({
					user: sessionUser,
					isAuthenticated: true,
				})

				return { ok: true }
			},
			signOut: () => {
				clearDemoAuthCookie()
				if (typeof localStorage !== 'undefined') {
					localStorage.removeItem(DEMO_AUTH_STORAGE_SESSION_EMAIL_KEY)
				}
				set({ isAuthenticated: false, user: null })
			},
		}),
		{
			name: 'demo-auth-store',
			partialize: (state) => ({
				isAuthenticated: state.isAuthenticated,
				user: state.user,
				users: state.users,
			}),
			// Make hydration safe and also keep a dedicated, explicit users key for visibility.
			onRehydrateStorage: () => (state) => {
				if (!state || typeof localStorage === 'undefined') {
					return
				}
				// Keep a plain users key for easy inspection in devtools/localStorage.
				localStorage.setItem(
					DEMO_AUTH_STORAGE_USERS_KEY,
					JSON.stringify(state.users)
				)

				// If we have a session email but store isn't authenticated, try to restore session.
				const sessionEmail = localStorage.getItem(
					DEMO_AUTH_STORAGE_SESSION_EMAIL_KEY
				)
				if (!sessionEmail || state.isAuthenticated) {
					return
				}

				const users = safeJsonParse<DemoAuthUser[]>(
					localStorage.getItem(DEMO_AUTH_STORAGE_USERS_KEY),
					state.users || []
				)
				const user = users.find(
					(u) => u.email.toLowerCase() === sessionEmail.toLowerCase()
				)
				if (user) {
					state.isAuthenticated = true
					state.user = {
						fullName: user.fullName,
						email: user.email,
						dob: user.dob,
					}
					state.users = users
				}
			},
		}
	)
)

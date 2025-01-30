/* eslint-disable */

import { Account } from 'next-auth'
import GoogleProvider, { GoogleProfile } from 'next-auth/providers/google'

import { fetchAPI } from '@/lib/fetch-api'

import {
	LoginBodyParams,
	LoginResponse,
	SessionData,
} from '@/types/admin-types'
import { TNoParams } from '@/types/common'

const authOptions = {
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID!,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
			authorization: {},
		}),
	],
	callbacks: {
		async session({ session, token }: any) {
			session.uid = token.uid
			session.accessToken = token.accessToken
			return session as SessionData
		},
		async jwt(params: any) {
			console.dir({ jwtParams: params }, { depth: null })
			const account: Account = params.account
			const token = params.token
			if (account?.id_token) {
				const resp = await fetchAPI<LoginResponse, TNoParams, LoginBodyParams>({
					url: '/auth/login/',
					method: 'POST',
					body: {
						token: account.id_token,
					},
				})
				token.uid = resp.data?.uid
				token.accessToken = resp?.data?.access_token
			}
			return token
		},
		async signIn(params: any) {
			const account: Account = params.account
			const profile: GoogleProfile = params.profile

			if (account.provider === 'google' && account.id_token) {
				if (
					!profile.email.endsWith('@pocketfm.in') &&
					!profile.email.endsWith('@pocketfm.com')
				) {
					return false
				}
				return true
			}
			return false
		},
	},
	pages: {
		signIn: '/auth/signin',
		signOut: '/auth/signout',
	},
}

export default authOptions

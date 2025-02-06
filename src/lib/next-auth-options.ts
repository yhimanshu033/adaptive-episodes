/* eslint-disable */

import { Account } from 'next-auth'
import GoogleProvider, { GoogleProfile } from 'next-auth/providers/google'

import { fetchAPI } from '@/lib/fetch-api'

import {
	LoginBodyParams,
	LoginResponse,
	SessionData,
	UserData,
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
		async signIn(params: any) {
			const account: Account = params.account
			const profile: GoogleProfile = params.profile

			if (account.provider === 'google') {
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

		async session({ session, token }: any) {
			session.uid = token.uid
			session.accessToken = token.accessToken
			const resp = await fetchAPI<{ data: UserData }, TNoParams, TNoParams>({
				method: 'GET',
				url: '/user/me',
			})
			if (resp.data) {
				session.user = resp.data
			}
			return session as SessionData
		},

		async jwt(params: any) {
			const account: Account = params.account
			const token = params.token
			if (account?.id_token) {
				const resp = await fetchAPI<LoginResponse, TNoParams, LoginBodyParams>({
					url: '/auth/login/',
					method: 'POST',
					body: {
						token: account.id_token,
					},
					noAuth: true,
				})
				token.uid = resp.data?.data.uid
				token.accessToken = resp?.data?.data.access_token
			}
			return token
		},

		authorized({ token }: any) {
			if (token?.accessToken) return true // TODO: add user check here
		},
	},
	pages: {
		signIn: '/auth/signin',
		signOut: '/auth/signout',
	},
}

export default authOptions

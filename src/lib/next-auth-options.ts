/* eslint-disable */

import { API_URLS } from '@/constants/global-constants'
import { Account } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

import { fetchAPIServer } from '@/lib/fetch-api-server'

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
			httpOptions: {
				timeout: 10000, // Set a timeout for the request
			},
		}),
	],
	callbacks: {
		async session(params: any) {
			const { session, token } = params
			session.uid = token.uid
			session.accessToken = token.accessToken
			session.user = {
				...session.user,
				...token.user,
				image: session.user.image,
			}
			return session as SessionData
		},

		async jwt(params: any) {
			const account: Account = params.account
			const token = params.token
			if (account?.id_token) {
				const resp = await fetchAPIServer<
					LoginResponse,
					TNoParams,
					LoginBodyParams
				>({
					method: 'POST',
					url: API_URLS.LOGIN,
					body: {
						token: account.id_token,
					},
					noAuth: true,
				})

				const userData = await fetchAPIServer<
					{ data: UserData },
					TNoParams,
					TNoParams
				>({
					method: 'GET',
					url: API_URLS.GET_MY_USER,
					headers: {
						Authorization: `Bearer ${resp.data?.data.access_token}`,
					},
				})
				if (userData.data?.data) {
					token.user = {
						...userData.data.data,
						fullname:
							userData.data.data.fullname ??
							userData.data.data.firstname + ' ' + userData.data.data.lastname,
					}
				}
				token.uid = resp.data?.data.uid
				token.accessToken = resp?.data?.data.access_token
			}
			return token
		},

		authorized({ token }: any) {
			if (token?.accessToken && token?.user) return true
		},
	},
	pages: {
		signIn: '/auth/signin',
		signOut: '/auth/signout',
	},
}

export default authOptions

/* eslint-disable */

import { Account } from 'next-auth'
import GoogleProvider, { GoogleProfile } from 'next-auth/providers/google'

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
				return (
					profile.email.endsWith('@pocketfm.in') ||
					profile.email.endsWith('@pocketfm.com')
				)
			}
			return true
		},
	},
	pages: {
		signIn: '/auth/signin',
		signOut: '/auth/signout',
	},
}

export default authOptions

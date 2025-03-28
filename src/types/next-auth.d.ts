import 'next-auth'

import { UserData } from './admin-types'

declare module 'next-auth' {
	interface Session {
		accessToken: string
		uid: string
		user: UserData
	}
}

declare module 'next-auth/jwt' {
	interface JWT {
		accessToken: string
		uid: string
		user: UserData
	}
}

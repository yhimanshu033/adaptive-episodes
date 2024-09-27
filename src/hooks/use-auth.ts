'use client'

import { useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import { DASHBOARD } from '@/constants/route-constants'
import { signIn, useSession } from 'next-auth/react'

const useAuth = () => {
	const session = useSession()
	const searchParams = useSearchParams()

	const callbackUrl = searchParams.get('callbackUrl') ?? DASHBOARD

	const onSignInWithGoogle = useCallback(() => {
		void (async () => {
			try {
				const status = await signIn('google', {
					redirect: true,
					callbackUrl,
				})

				console.log(status)
			} catch (err) {
				console.error(err)
			}
		})()
	}, [callbackUrl])

	return {
		session,
		onSignInWithGoogle,
	}
}

export default useAuth

'use client'

import { useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import { DASHBOARD } from '@/constants/route-constants'
import { signIn, useSession } from 'next-auth/react'
import { toast } from 'sonner'

const useAuth = () => {
	const session = useSession()
	const searchParams = useSearchParams()

	const callbackUrl = searchParams.get('callbackUrl') ?? DASHBOARD

	const onSignInWithGoogle = useCallback(() => {
		void (async () => {
			try {
				await signIn('google', {
					redirect: true,
					callbackUrl,
				})

				toast.success('Signing in with google!')
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

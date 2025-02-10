'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import useUnsavedChecker from '@/hooks/use-unsaved-checker'
import { signOut, useSession } from 'next-auth/react'

import { Button } from '@/components/ui/button'
import Spinner from '@/components/ui/spinner'

export default function LogOutButton() {
	const session = useSession()
	const { data } = session
	const [isLoading, setIsLoading] = useState(false)
	const { handleUnsaved } = useUnsavedChecker()

	const handleLogout = async () => {
		setIsLoading(true)
		try {
			await handleUnsaved(true)
			await signOut()
		} catch (error) {
			console.error({ error })
		} finally {
			setIsLoading(false)
		}
	}

	if (!data) {
		return <Link href="/auth/signin">Login</Link>
	}

	return (
		<Button
			tooltip={'Log out'}
			variant="ghost"
			disabled={isLoading}
			onClick={() => void handleLogout()}
		>
			{isLoading ? <Spinner size={24} /> : 'Logout'}
		</Button>
	)
}

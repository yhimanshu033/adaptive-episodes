'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { signOut, useSession } from 'next-auth/react'

import { Button, ButtonProps } from '@/components/ui/button'
import Spinner from '@/components/ui/spinner'

export default function LogOutButton(props: ButtonProps) {
	const session = useSession()
	const { data } = session
	const [isLoading, setIsLoading] = useState(false)

	const handleLogout = async () => {
		setIsLoading(true)
		try {
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
			{...props}
			disabled={isLoading}
			onClick={() => void handleLogout()}
		>
			{isLoading ? <Spinner size={24} /> : 'Logout'}
		</Button>
	)
}

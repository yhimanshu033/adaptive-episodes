'use client'

import React from 'react'
import Link from 'next/link'
import { signOut, useSession } from 'next-auth/react'

import { Button } from '@/components/ui/button'

export default function LogOutButton() {
	const session = useSession()
	const { data } = session

	const handleLogout = () => {
		signOut().catch(() => {})
	}

	if (!data) {
		return <Link href="/auth/signin">Login</Link>
	}

	return (
		<Button variant="ghost" onClick={handleLogout}>
			Logout
		</Button>
	)
}

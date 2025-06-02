'use client'

import React from 'react'
import Link from 'next/link'
import useAuth from '@/hooks/use-auth'
// import useUnsavedChecker from '@/hooks/use-unsaved-checker'
import { useSession } from 'next-auth/react'

import { Avatar } from '@/components/avatar'

export default function UserProfile() {
	const { data } = useSession()
	// useUnsavedChecker() - use cases in corner cases : may have to move this logic at logout btn on profile popover
	const { session } = useAuth()
	const user = session?.data?.user

	console.log({ user })

	if (!data) {
		return <Link href="/auth/signin">Login</Link>
	}

	return (
		<Avatar src={user?.image} alt={user?.fullname} fallback={user?.fullname} />
	)
}
